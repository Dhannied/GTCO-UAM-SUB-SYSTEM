import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee: string;

  @Column()
  employeeId: string;

  @Column()
  application: string;

  @Column()
  actionType: string;

  @Column()
  reason: string;

  @Column()
  officer: string;

  @CreateDateColumn()
  date: Date;
}