import { Dependence } from '@dependence/entity/dependence.entity';
import { EventFile } from '@event/entity/event-file.entity';
import { Member } from '@member/entity/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Delegation {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true, default: '' })
  code: string;

  @Column({ nullable: true, default: '' })
  name: string;

  @Column()
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Dependence, (dependence) => dependence.delegations, {
    nullable: true,
  })
  @JoinColumn({
    name: 'dependence_id',
    referencedColumnName: 'uuid',
  })
  dependence: Dependence;

  @OneToOne(() => Member, (member) => member.delegation, { nullable: true })
  @JoinColumn({
    name: 'titular_id',
    referencedColumnName: 'uuid',
  })
  titular: Member | null;

  @OneToMany(() => EventFile, (eventFile) => eventFile.deletation)
  eventFiles: EventFile[];
}
