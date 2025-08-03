import { Delegation } from '@delegation/entity/delegation.entity';
import { EventMember } from '@event/entity/event-members.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  full_name: string;

  @Column({ nullable: true })
  rfc: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ nullable: true })
  nom: string;

  @Column()
  contribution: boolean;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Delegation, (delegation) => delegation.titular)
  delegation: Delegation;

  @OneToMany(() => EventMember, (eventMember) => eventMember.member)
  eventMembers: EventMember[];
}
