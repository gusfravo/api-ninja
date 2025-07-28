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
  })
  end_date: Date;

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
}
