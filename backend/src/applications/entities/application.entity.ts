import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @Column({ default: 'Active' })
  status: string;

  @Column({ nullable: true })
  deactivationType: string;

  @ManyToOne(() => User, user => user.applications, { nullable: true })
  user: User;

  @ManyToOne(() => UamUser, uamUser => uamUser.applications, { nullable: true })
  uamUser: UamUser;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
