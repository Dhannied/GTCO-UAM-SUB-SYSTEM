import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee: string;

  @Column()
  employeeId: string; // This should store the employee's business ID, not the database ID

  @Column()
  application: string;

  @Column()
  actionType: string;

  @Column()
  reason: string;

  @Column()
  officer: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  duration: string;

  @CreateDateColumn()
  date: Date;
}

