import { ResponseUploadEventFile } from '@event/dto/ResponseUploadFileEvent.dto';
import { EventExcel } from '@event/entity/event-excel.entity';
import { getDateFromRFC } from '@event/utils/date.utils';
import { CreateMember } from '@member/dto/create-member.dto';
import { Member } from '@member/entity/member.entity';
import { MemberService } from '@member/service/member.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { from, map, of, switchMap, tap, throwError } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import * as xlsx from 'xlsx'; // Importamos la librería xlsx

@Injectable()
export class EventExcelService {
  constructor(
    @InjectRepository(EventExcel)
    private eventExcelRepository: Repository<EventExcel>,
    @InjectDataSource() private readonly dbSource: DataSource,
    private readonly memberService: MemberService,
  ) {}

  findByEvent(eventId: string) {
    return from(
      this.eventExcelRepository.findOne({
        where: { event: { uuid: eventId } },
      }),
    );
  }

  create({ file, eventId }: { file: Express.Multer.File; eventId: string }) {
    const saveEventExcel: EventExcel = Object.assign(new EventExcel(), {
      excel: file.buffer,
      type: file.mimetype,
      name: file.originalname,
      event: eventId,
    });

    return this.findByEvent(eventId).pipe(
      switchMap((eventExcel) => {
        if (eventExcel) return of(eventExcel);
        return from(this.eventExcelRepository.save(saveEventExcel));
      }),
      map((item) => {
        return plainToInstance(ResponseUploadEventFile, item, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }

  readExcelFromEvent(eventId: string) {
    const eventExcel$ = from(
      this.eventExcelRepository.findOne({
        where: { event: { uuid: eventId } },
      }),
    );

    return eventExcel$
      .pipe(
        tap((excelDB) => {
          if (!excelDB)
            return throwError(
              () => new InternalServerErrorException('Error file not found'),
            );
          const workbook = xlsx.read(excelDB.excel, { type: 'buffer' });
          const first_sheet = workbook.Sheets[workbook.SheetNames[0]];
          // 4. Convertir la hoja de trabajo a un array de objetos JSON
          const data = xlsx.utils.sheet_to_json(first_sheet, { header: 1 });
          console.log(workbook.SheetNames);
          //console.log(first_sheet);
          console.log(data);
          //
        }),
      )
      .pipe(
        map((item) => {
          return plainToInstance(ResponseUploadEventFile, item, {
            excludeExtraneousValues: true,
          });
        }),
      );
  }

  async processExcel(eventId: string) {
    try {
      const excelDB = await this.eventExcelRepository.findOne({
        where: { event: { uuid: eventId } },
      });

      if (!excelDB)
        throw new InternalServerErrorException('Recuerso no encontrado');

      const workbook = xlsx.read(excelDB.excel, { type: 'buffer' });
      const first_sheet = workbook.Sheets[workbook.SheetNames[0]];
      // 4. Convertir la hoja de trabajo a un array de objetos JSON
      const data = xlsx.utils.sheet_to_json(first_sheet, { header: 1 });
      console.log(workbook.SheetNames);
      //console.log(first_sheet);
      //console.log(data);
      //Elminamos las cabeceras
      data.shift();
      data.shift();

      // 1. Get a QueryRunner to manage the connection and transaction
      const queryRunner = this.dbSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 2. Create the temporary table with raw SQL
        await queryRunner.query(`
        CREATE TEMPORARY TABLE temp_data (
            PGRFC VARCHAR(255),
            NombreCompleto VARCHAR(255),
            PGDEP1 VARCHAR(255),
            NOMINA VARCHAR(255),
            Secretaria VARCHAR(255),
            CuotaSindical VARCHAR(255)
        );
      `);

        // 3. Prepare the data for a bulk insert
        const insertValues = data
          .map(
            (record: any[]) =>
              `('${record[0]}', '${record[1]}', '${record[2]}', '${record[3]}', '${record[4]}', '${record[5]}')`,
          )
          .join(', ');

        // 4. Insert data into the temporary table
        await queryRunner.query(`
        INSERT INTO temp_data (PGRFC, NombreCompleto, PGDEP1, NOMINA, Secretaria, CuotaSindical)
        VALUES ${insertValues};
      `);

        // Consultar datos
        const result = await queryRunner.query(
          `SELECT COUNT(*) FROM temp_data;`,
        );
        console.log('Total de registros en la tabla temporal', result);

        const notInMember: any[] = await queryRunner.query(
          //'SELECT * FROM member WHERE EXISTS (SELECT PGRFC FROM temp_data WHERE member.rfc = temp_data.PGRFC)',
          'SELECT * FROM temp_data WHERE NOT EXISTS (SELECT 1 FROM member WHERE member.rfc = temp_data.PGRFC)',
        );
        console.log(
          'Total no registrados a importar en la tabla de member',
          notInMember.length,
        );

        const insertMembers: Member[] = notInMember.map((item) => {
          const birthDate = getDateFromRFC(item.PGRFC);

          const saveMember: Member = Object.assign(new Member(), {
            full_name: item.NombreCompleto,
            rfc: item.PGRFC,
            birth_date: birthDate ?? new Date(),
            department: item.PGDEP1,
            nom: item.NOMINA,
            secretary: item.Secretaria,
            contribution: item.CuotaSindical,
            status: true,
            is_real_member: true,
          });

          return saveMember;
        });
        // 6. Commit the transaction if everything was successful
        await queryRunner.commitTransaction();

        console.log(insertMembers);

        await this.memberService.onBulkInsert(insertMembers);

        // Eliminamos la base de datos temporal
        await queryRunner.query('DROP TEMPORARY TABLE temp_data;');
        //await queryRunner.commitTransaction();
      } catch (err) {
        // Rollback the transaction if any error occurs
        //await queryRunner.rollbackTransaction();
        throw new Error('Failed to import data: ' + err);
      } finally {
        // Release the QueryRunner connection
        console.log('Metodo terminado');
        await queryRunner.release();
      }
    } catch (e) {
      console.log(e);
      throw new Error('Failed to import or process data', e);
    }
  }
}
