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
import { Event } from './event.entity';
import { Delegation } from '@delegation/entity/delegation.entity';
import { EventMember } from './event-members.entity';

@Entity()
export class EventFile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  resource_file_type: string;

  @Column({
    type: 'longblob',
    nullable: true,
  })
  resource_file: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.files)
  @JoinColumn({
    name: 'event_id',
    referencedColumnName: 'uuid',
  })
  event: Event;

  @ManyToOne(() => Delegation, (delegation) => delegation.eventFiles)
  @JoinColumn({
    name: 'delegation_id',
    referencedColumnName: 'uuid',
  })
  deletation: Delegation;

  @OneToMany(() => EventMember, (eventMember) => eventMember.eventFile)
  eventMembers: EventMember[];
}
