import { EventExcel } from '@event/entity/event-excel.entity';
import { EventFile } from '@event/entity/event-file.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, of, switchMap } from 'rxjs';
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

        // Build RFC set for comparison against uploaded Excel
        const eventMemberRfcSet = new Set(
          allMembers
            .map((em) => em.member?.rfc?.trim().toUpperCase())
            .filter(Boolean) as string[],
        );

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

        // Tab 1: Agremiados General
        const sheetName = 'Agremiados General';
        const existingIdx = workbook.SheetNames.indexOf(sheetName);
        if (existingIdx !== -1) {
          workbook.SheetNames.splice(existingIdx, 1);
          delete workbook.Sheets[sheetName];
        }
        const worksheet = xlsx.utils.json_to_sheet(rows, { header: headers });
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Tab 2: "sin delegacion" — rows from uploaded Excel whose RFC is not captured as EventMember
        if (eventExcel?.excel) {
          const sourceWb = xlsx.read(eventExcel.excel, { type: 'buffer' });
          const skipSheets = new Set(['Agremiados General', 'sin delegacion']);
          const seenRfcs = new Set<string>();
          const sinDelegacionRows: Record<string, string>[] = [];

          sourceWb.SheetNames
            .filter((s) => !skipSheets.has(s))
            .forEach((s) => {
              const sheetRows = xlsx.utils.sheet_to_json<Record<string, string>>(
                sourceWb.Sheets[s],
                { defval: '' },
              );
              sheetRows.forEach((row) => {
                const rfc = (row['PGRFC'] ?? row['RFC'] ?? '').toString().trim().toUpperCase();
                if (rfc && !eventMemberRfcSet.has(rfc) && !seenRfcs.has(rfc)) {
                  seenRfcs.add(rfc);
                  sinDelegacionRows.push(row);
                }
              });
            });

          if (sinDelegacionRows.length > 0) {
            const sinDelName = 'sin delegacion';
            const sinDelIdx = workbook.SheetNames.indexOf(sinDelName);
            if (sinDelIdx !== -1) {
              workbook.SheetNames.splice(sinDelIdx, 1);
              delete workbook.Sheets[sinDelName];
            }
            const sinDelSheet = xlsx.utils.json_to_sheet(sinDelegacionRows);
            xlsx.utils.book_append_sheet(workbook, sinDelSheet, sinDelName);
          }
        }

        return {
          buffer: xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer,
        };
      }),
    );
  }

  generateByEventFileFormatted(eventFileId: string) {
    return from(
      this.eventFileRepository.findOne({
        where: { uuid: eventFileId },
        relations: {
          event: true,
          deletation: true,
          eventMembers: {
            member: true,
            additionalStates: true,
            dependence: true,
          },
        },
      }),
    ).pipe(
      switchMap((eventFile) => {
        if (!eventFile) throw new NotFoundException('EventFile no encontrado');
        return of(eventFile);
      }),
      map((eventFile) => {
        const members = eventFile.eventMembers ?? [];
        const delegationCode = eventFile.deletation?.code ?? '';
        const dependenceName = eventFile.dependence_name ?? '';

        const ws: xlsx.WorkSheet = {};
        const set = (c: number, r: number, v: string | number) => {
          ws[xlsx.utils.encode_cell({ c, r })] = { v, t: typeof v === 'number' ? 'n' : 's' };
        };
        const getState = (em: any, key: string): string =>
          ((em.additionalStates ?? []) as any[]).some((s: any) => s.key === key && s.value)
            ? 'X'
            : '';

        // r=1 (row 2): Title
        set(0, 1, 'SECRETARIA DE  ACTAS Y ACUERDOS');
        // r=2 (row 3): Subtitle
        set(0, 2, 'DOCUMENTACION DE  ÚTILES ESCOLARES 2025');
        // r=3 (row 4): DEPENDENCIA / CLAVE DELEGACIONAL
        set(0, 3, `DEPENDENCIA: ${dependenceName}`);
        set(13, 3, `CLAVE DELEGACIONAL: ${delegationCode}`);

        // r=5 (row 6): Column group headers
        set(0, 5, 'Nº');
        set(1, 5, 'NOMBRE DEL TRABAJADOR (Empezando por el apellido en orden alfabético)');
        set(2, 5, 'NOMBRE DEL HIJO (A) (Empezando por el apellido en orden alfabético)');
        set(3, 5, 'TRABAJADOR ESTUDIANTE (X)');
        set(4, 5, 'DEPENDENCIA');
        set(5, 5, 'NIVEL ESCOLAR');
        set(6, 5, 'DOCUMENTACIÓN EN ORIGINAL');
        set(9, 5, 'DOCUMENTACIÓN EN COPIA');
        set(14, 5, 'CARTA COMPROMISO');
        set(16, 5, 'EXENTO');
        set(17, 5, 'OBSERVACIONES');
        set(18, 5, 'APROBADO');

        // r=7 (row 8): Individual column headers
        set(6, 7, 'BOLETA ');
        set(7, 7, 'CONSTANCIA');
        set(8, 7, 'RECIBO DE INSCRIPCIÓN');
        set(9, 7, 'SOBRE DE PAGO');
        set(10, 7, 'ACTA NACIMIENTO');
        set(11, 7, 'BOLETA ');
        set(12, 7, 'CONSTANCIA');
        set(13, 7, 'RECIBO DE INSCRIPCIÓN');
        set(14, 7, 'CONSTANCIA O BOLETA');
        set(15, 7, 'RECIBO DE INSCRIPCIÓN');
        set(16, 7, 'EXENTO DE INSCRIPCIÓN');

        // Data rows starting at r=8 (row 9)
        members.forEach((em, idx) => {
          const r = 8 + idx;
          set(0, r, idx + 1);
          set(1, r, em.member?.full_name ?? '');
          set(2, r, em.child_name ?? '');
          set(3, r, getState(em, 'Trabajador Estudiante'));
          set(4, r, em.dependence?.name ?? '');
          set(5, r, em.school_level ?? '');
          set(6, r, getState(em, 'Boleta Original'));
          set(7, r, getState(em, 'Constancia Original'));
          set(8, r, getState(em, 'Recibo Inscripción Original'));
          set(9, r, getState(em, 'Sobre de Pago'));
          set(10, r, getState(em, 'Acta Nacimiento'));
          set(11, r, getState(em, 'Boleta Copia'));
          set(12, r, getState(em, 'Constancia Copia'));
          set(13, r, getState(em, 'Recibo Inscripción Copia'));
          set(14, r, getState(em, 'Constancia o Boleta'));
          set(15, r, getState(em, 'Recibo Inscripción Carta'));
          set(16, r, getState(em, 'Exento de Inscripción'));
          set(17, r, em.observations ?? '');
          set(18, r, em.approved ? 'SI' : 'NO');
        });

        // Signature rows (at least 17 data rows as in template, then 2 blank, then sigs)
        const sigR1 = 8 + Math.max(members.length, 17) + 2;
        const sigR2 = sigR1 + 1;
        set(1, sigR1, '________________________________________');
        set(11, sigR1, '__________________________________');
        set(1, sigR2, '           DELEGADO SINDICAL');
        set(11, sigR2, 'DELEGADO SINDICAL');

        ws['!ref'] = xlsx.utils.encode_range({ s: { c: 0, r: 1 }, e: { c: 18, r: sigR2 } });

        ws['!merges'] = [
          { s: { c: 0, r: 1 }, e: { c: 18, r: 1 } },   // A2:S2  Title
          { s: { c: 0, r: 2 }, e: { c: 18, r: 2 } },   // A3:S3  Subtitle
          { s: { c: 0, r: 3 }, e: { c: 12, r: 3 } },   // A4:M4  DEPENDENCIA
          { s: { c: 13, r: 3 }, e: { c: 18, r: 3 } },  // N4:S4  CLAVE DELEGACIONAL
          { s: { c: 0, r: 5 }, e: { c: 0, r: 7 } },    // A6:A8  Nº
          { s: { c: 1, r: 5 }, e: { c: 1, r: 7 } },    // B6:B8  NOMBRE TRABAJADOR
          { s: { c: 2, r: 5 }, e: { c: 2, r: 7 } },    // C6:C8  NOMBRE HIJO
          { s: { c: 3, r: 5 }, e: { c: 3, r: 7 } },    // D6:D8  TRABAJADOR ESTUDIANTE
          { s: { c: 4, r: 5 }, e: { c: 4, r: 7 } },    // E6:E8  DEPENDENCIA
          { s: { c: 5, r: 5 }, e: { c: 5, r: 7 } },    // F6:F8  NIVEL ESCOLAR
          { s: { c: 6, r: 5 }, e: { c: 8, r: 6 } },    // G6:I7  DOCUMENTACIÓN EN ORIGINAL
          { s: { c: 9, r: 5 }, e: { c: 13, r: 6 } },   // J6:N7  DOCUMENTACIÓN EN COPIA
          { s: { c: 14, r: 5 }, e: { c: 15, r: 6 } },  // O6:P7  CARTA COMPROMISO
          { s: { c: 16, r: 5 }, e: { c: 16, r: 6 } },  // Q6:Q7  EXENTO
          { s: { c: 17, r: 5 }, e: { c: 17, r: 7 } },  // R6:R8  OBSERVACIONES
          { s: { c: 18, r: 5 }, e: { c: 18, r: 7 } },  // S6:S8  APROBADO
          { s: { c: 1, r: sigR1 }, e: { c: 2, r: sigR1 } },
          { s: { c: 11, r: sigR1 }, e: { c: 16, r: sigR1 } },
          { s: { c: 1, r: sigR2 }, e: { c: 2, r: sigR2 } },
          { s: { c: 11, r: sigR2 }, e: { c: 16, r: sigR2 } },
        ];

        const wb = xlsx.utils.book_new();
        const sheetName = (eventFile.deletation?.name ?? 'Formato').slice(0, 31);
        xlsx.utils.book_append_sheet(wb, ws, sheetName);

        return {
          buffer: xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer,
          delegationName: eventFile.deletation?.name ?? 'formato',
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
