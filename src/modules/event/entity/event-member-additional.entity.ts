import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventMember } from './event-members.entity';

@Entity()
export class EventMemberAdditionalState {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  key: string;

  @Column({ default: false })
  value: boolean;

  @ManyToOne(
    (): typeof EventMember => EventMember,
    (eventMember: EventMember): EventMemberAdditionalState[] =>
      eventMember.additionalStates,
  )
  @JoinColumn({
    name: 'event_member_id',
    referencedColumnName: 'uuid',
  })
  eventMember: EventMember;
}
