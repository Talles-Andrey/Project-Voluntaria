import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Ngo } from 'src/ngos/entities/ngo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('opportunities')
export class Opportunity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  location: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, nullable: false })
  cause: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: false })
  endDate: Date;

  @ApiProperty()
  @Column({ type: 'int', nullable: false })
  maxVolunteers: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: 'open' | 'closed' | 'completed';

  @ApiProperty({ type: () => Ngo })
  @ManyToOne(() => Ngo, { nullable: false })
  ngo: Ngo;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  ngoId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  constructor(
    title: string,
    description: string,
    location: string,
    cause: string,
    startDate: Date,
    endDate: Date,
    maxVolunteers: number,
    ngoId: string,
  ) {
    this.title = title;
    this.description = description;
    this.location = location;
    this.cause = cause;
    this.startDate = startDate;
    this.endDate = endDate;
    this.maxVolunteers = maxVolunteers;
    this.ngoId = ngoId;
  }
}
