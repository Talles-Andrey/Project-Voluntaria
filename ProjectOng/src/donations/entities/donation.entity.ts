import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('donations')
export class Donation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  donorName?: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  donorEmail: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  message: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  anonymous: boolean;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: true })
  donor: User;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  donorId: string;

  @ApiProperty({ type: () => Campaign })
  @ManyToOne(() => Campaign, { nullable: false })
  campaign: Campaign;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: false })
  campaignId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    amount: number,
    anonymous: boolean,
    campaignId: string,
    message?: string,
    donorName?: string,
    donorEmail?: string,
  ) {
    this.amount = amount;
    this.donorName = donorName || '';
    this.donorEmail = donorEmail || '';
    this.message = message || '';
    this.anonymous = anonymous;
    this.campaignId = campaignId;
  }
}
