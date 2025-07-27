import {
  Column,
  CreateDateColumn,
  Entity,
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
}
