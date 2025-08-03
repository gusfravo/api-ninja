import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Member } from '@member/entity/member.entity';

@Entity()
export class EventMember {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  full_name: string;

  @Column()
  observations: string;

  @Column({ default: false })
  approved: boolean;

  @Column()
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Event, (event) => event.members)
  @JoinColumn({
    name: 'event_id',
    referencedColumnName: 'uuid',
  })
  event: Event;

  @ManyToOne(() => Member, (member) => member.eventMembers)
  @JoinColumn({
    name: 'member_id',
    referencedColumnName: 'uuid',
  })
  member: Member;
}
