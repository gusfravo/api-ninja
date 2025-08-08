import { Benefit } from '@benefit/entity/benefit.entity';
import { EventStatus } from '@event/enums/event-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventFile } from './event-file.entity';
import { EventMember } from './event-members.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  status: EventStatus;

  @Column({
    type: 'date',
  })
  start_date: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  end_date: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Benefit, (benefit) => benefit.events)
  @JoinColumn({
    name: 'benefit_id',
    referencedColumnName: 'uuid',
  })
  benefit: Benefit;

  @OneToMany(() => EventFile, (eventFile) => eventFile.event)
  files: EventFile[];

  @OneToMany(() => EventMember, (eventMember) => eventMember.event)
  members: EventMember[];
}
