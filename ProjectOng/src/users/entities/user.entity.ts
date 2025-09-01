import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { Donation } from '../../donations/entities/donation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  city: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 2, nullable: false })
  state: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, default: 'volunteer' })
  userType: 'volunteer' | 'ngo';

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  experience: string;

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: true })
  preferredCauses: string[];

  @ApiProperty()
  @OneToMany(() => Project, (project) => project.ngo)
  projects: Project[];

  @ApiProperty()
  @OneToMany(() => Campaign, (campaign) => campaign.ngo)
  campaigns: Campaign[];

  @ApiProperty()
  @OneToMany(() => Enrollment, (enrollment) => enrollment.volunteer)
  enrollments: Enrollment[];

  @ApiProperty()
  @OneToMany(() => Rating, (rating) => rating.user)
  ratingsGiven: Rating[];

  @ApiProperty()
  @OneToMany(() => Donation, (donation) => donation.donor)
  donations: Donation[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    city: string,
    state: string,
    userType: 'volunteer' | 'ngo' = 'volunteer',
    skills: string[] = [],
    experience: string = '',
    preferredCauses: string[] = [],
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.city = city;
    this.state = state;
    this.userType = userType;
    this.skills = skills;
    this.experience = experience;
    this.preferredCauses = preferredCauses;
  }
}
