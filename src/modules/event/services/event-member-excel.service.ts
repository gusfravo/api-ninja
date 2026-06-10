import { EventExcel } from '@event/entity/event-excel.entity';
import { EventFile } from '@event/entity/event-file.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';

@Injectable()
export class EventMemberExcelService {
  constructor(
    @InjectRepository(EventFile)
    private readonly eventFileRepository: Repository<EventFile>,
    @InjectRepository(EventExcel)
    private readonly eventExcelRepository: Repository<EventExcel>,
  ) {}

  generateByEvent(eventId: string) {
    return from(
      this.eventFileRepository.find({
        where: { event: { uuid: eventId } },
        relations: {
          event: true,
          deletation: true,
          eventMembers: {
            member: true,
            additionalStates: true,
          },
        },
      }),
    ).pipe(
      switchMap((eventFiles) => {
        if (!eventFiles.length) throw new NotFoundException('No se encontraron archivos para el evento');
        return from(
          this.eventExcelRepository.findOne({ where: { event: { uuid: eventId } } }),
        ).pipe(map((eventExcel) => ({ eventFiles, eventExcel })));
      }),
      map(({ eventFiles, eventExcel }) => {
        const allMembers = eventFiles.flatMap((f) => f.eventMembers);

        const additionalKeySet = new Set<string>();
        allMembers.forEach((m) =>
          m.additionalStates.forEach((s) => additionalKeySet.add(s.key)),
        );
        const extraKeys = Array.from(additionalKeySet);

        const headers = [
          'PGRFC',
          'NOMBRE',
          'PGDEP1',
          'NOMINA',
          'SECRETARIA',
          'CUOTA SINDICAL',
          'APROBADO',
          ...extraKeys,
        ];

        const rows = allMembers.map((em) => {
          const row: Record<string, string> = {
            PGRFC: em.member?.rfc ?? '',
            NOMBRE: em.member?.full_name ?? '',
            PGDEP1: em.member?.department ?? '',
            NOMINA: em.member?.nom ?? '',
            SECRETARIA: em.member?.secretary ?? '',
            'CUOTA SINDICAL': em.member?.contribution ? 'APORTA' : 'NO APORTA',
            APROBADO: em.approved ? 'SI' : 'NO',
          };
          extraKeys.forEach((key) => {
            const state = em.additionalStates.find((s) => s.key === key);
            row[key] = state?.value ? 'SI' : 'NO';
          });
          return row;
        });

        const workbook = eventExcel?.excel
          ? xlsx.read(eventExcel.excel, { type: 'buffer' })
          : xlsx.utils.book_new();

        const sheetName = 'Agremiados General';
        const existingIdx = workbook.SheetNames.indexOf(sheetName);
        if (existingIdx !== -1) {
          workbook.SheetNames.splice(existingIdx, 1);
          delete workbook.Sheets[sheetName];
        }

        const worksheet = xlsx.utils.json_to_sheet(rows, { header: headers });
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

        return {
          buffer: xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer,
        };
      }),
    );
  }

  generateByEventFile(eventFileId: string) {
    return from(
      this.eventFileRepository.findOne({
        where: { uuid: eventFileId },
        relations: {
          event: true,
          deletation: true,
          eventMembers: {
            member: true,
            additionalStates: true,
          },
        },
      }),
    ).pipe(
      switchMap((eventFile) => {
        if (!eventFile) throw new NotFoundException('EventFile no encontrado');
        return from(
          this.eventExcelRepository.findOne({
            where: { event: { uuid: eventFile.event.uuid } },
          }),
        ).pipe(map((eventExcel) => ({ eventFile, eventExcel })));
      }),
      map(({ eventFile, eventExcel }) => {
        // Collect all unique additional-state keys from all members
        const additionalKeySet = new Set<string>();
        eventFile.eventMembers.forEach((m) =>
          m.additionalStates.forEach((s) => additionalKeySet.add(s.key)),
        );
        const extraKeys = Array.from(additionalKeySet);

        const headers = [
          'PGRFC',
          'NOMBRE',
          'PGDEP1',
          'NOMINA',
          'SECRETARIA',
          'CUOTA SINDICAL',
          'APROBADO',
          ...extraKeys,
        ];

        const rows = eventFile.eventMembers.map((em) => {
          const row: Record<string, string> = {
            PGRFC: em.member?.rfc ?? '',
            NOMBRE: em.member?.full_name ?? '',
            PGDEP1: em.member?.department ?? '',
            NOMINA: em.member?.nom ?? '',
            SECRETARIA: em.member?.secretary ?? '',
            'CUOTA SINDICAL': em.member?.contribution ? 'APORTA' : 'NO APORTA',
            APROBADO: em.approved ? 'SI' : 'NO',
          };
          extraKeys.forEach((key) => {
            const state = em.additionalStates.find((s) => s.key === key);
            row[key] = state?.value ? 'SI' : 'NO';
          });
          return row;
        });

        // Use base workbook when available, otherwise create new
        const workbook = eventExcel?.excel
          ? xlsx.read(eventExcel.excel, { type: 'buffer' })
          : xlsx.utils.book_new();

        const sheetName = (eventFile.deletation?.name ?? 'Agremiados').slice(0, 31);
        const existingIdx = workbook.SheetNames.indexOf(sheetName);
        if (existingIdx !== -1) {
          workbook.SheetNames.splice(existingIdx, 1);
          delete workbook.Sheets[sheetName];
        }

        const worksheet = xlsx.utils.json_to_sheet(rows, { header: headers });
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

        return {
          buffer: xlsx.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
          }) as Buffer,
          delegationName: eventFile.deletation?.name ?? 'agremiados',
        };
      }),
    );
  }
}
