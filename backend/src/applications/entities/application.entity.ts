// ✅ Keep the enum in this same file
export enum ApplicationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
}
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { forwardRef } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UamUser } from '../../uam-users/entities/uam-user.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  platform: string;

  @Column()
  accessLevel: string;

  @Column({ nullable: true })
  lastUsed: Date;

  @Column()
  icon: string;

  @Column()
  iconBg: string;

@Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.ACTIVE })
status: ApplicationStatus;

@Column({ nullable: true })
deactivationType: 'Temporary' | 'Permanent';

@Column({ type: 'date', nullable: true })
startDate: Date;

@Column({ type: 'date', nullable: true })
endDate: Date;

  @ManyToOne(() => User, (user) => user.applications, { nullable: true })
  @JoinColumn({ name: 'userId' }) // 👈 Link user -> application
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => UamUser, (uamUser) => uamUser.applications, {
    nullable: true,
  })
  uamUser: UamUser;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
