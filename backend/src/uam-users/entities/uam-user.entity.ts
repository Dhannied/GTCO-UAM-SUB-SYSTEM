import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity()
export class UamUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @Column({ default: 'Active' })
  status: string;

  @Column()
  department: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true, type: 'datetime' })
  lastActive: Date;

  @Column({ nullable: true })
  employeeId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Application, application => application.uamUser)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
