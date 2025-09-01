import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('enrollments')
export class Enrollment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: false })
  volunteer: User;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  volunteerId: string;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, { nullable: false })
  project: Project;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  projectId: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' | 'completed';

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(projectId: string, volunteerId: string, status: string, notes?: string) {
    this.projectId = projectId;
    this.volunteerId = volunteerId;
    this.status = status as 'pending' | 'approved' | 'rejected' | 'completed';
    this.notes = notes || '';
  }
}
