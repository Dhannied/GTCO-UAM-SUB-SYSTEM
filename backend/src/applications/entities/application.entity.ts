import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @ManyToOne(() => User, user => user.applications)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}