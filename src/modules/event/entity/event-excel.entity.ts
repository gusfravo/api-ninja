import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class EventExcel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'longblob', nullable: true })
  excel: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Event)
  @JoinColumn({
    name: 'event_id',
    referencedColumnName: 'uuid',
  })
  event: Event;
}
