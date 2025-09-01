import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ratings')
export class Rating {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, { nullable: true })
  project: Project;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  projectId: string;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  score: number; // 1-5

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  comment: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  constructor(userId: string, score: number, comment: string, projectId: string) {
    this.userId = userId;
    this.projectId = projectId;
    this.score = score;
    this.comment = comment;
  }
}
