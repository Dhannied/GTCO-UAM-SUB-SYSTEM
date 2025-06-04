import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  role: string;

  @Column({ default: 'Active' })
  status: string;

  @Column()
  department: string;

  @Column({ nullable: true })
  lastActive: Date;

  @Column({ nullable: true })
  employeeId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  joinDate: Date;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true, select: false })
  password: string;

  @OneToMany(() => Application, application => application.user)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

