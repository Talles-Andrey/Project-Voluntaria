import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Ngo } from 'src/ngos/entities/ngo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('campaigns')
export class Campaign {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200, nullable: false, unique: true })
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  goalAmount: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentAmount: number;

  @ApiProperty()
  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @ApiProperty()
  @Column({ type: 'date', nullable: false })
  endDate: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  @ApiProperty({ type: () => Ngo })
  @ManyToOne(() => Ngo, { nullable: false })
  ngo: Ngo;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'campaign' })
  category: 'campaign' | 'opportunity';

  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  ngoId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  numberOfDonations: number;

  constructor(
    title: string,
    description: string,
    goalAmount: number,
    startDate: Date,
    endDate: Date,
    ngoId: string,
    category: 'campaign' | 'opportunity',
  ) {
    this.title = title;
    this.description = description;
    this.goalAmount = goalAmount;
    this.startDate = startDate;
    this.endDate = endDate;
    this.ngoId = ngoId;
    this.category = category;
  }
}
