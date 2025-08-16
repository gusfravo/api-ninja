import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventExcel } from './event-excel.entity';
import { Member } from '@member/entity/member.entity';

@Entity('event-excel-history')
export class EventExcelHistory {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => EventExcel)
  @JoinColumn({
    name: 'event_excel_id',
    referencedColumnName: 'uuid',
  })
  eventExcel: EventExcel;

  @ManyToOne(() => Member)
  @JoinColumn({
    name: 'member_id',
    referencedColumnName: 'uuid',
  })
  member: Member;
}
