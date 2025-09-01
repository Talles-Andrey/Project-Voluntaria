import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ngos')
export class Ngo {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200, nullable: false })
  organizationName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  cnpj: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  city: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 2, nullable: false })
  state: string;

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: false })
  causes: string[];

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: false })
  areas: string[];

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: true })
  skills: string[] = [];

  @ApiProperty()
  @Column({ type: 'simple-array', nullable: true })
  preferredCauses: string[] = [];

  @ApiProperty({ type: () => [Project] })
  @OneToMany(() => Project, (project) => project.ngo)
  projects: Project[];

  @ApiProperty({ type: () => [Campaign] })
  @OneToMany(() => Campaign, (campaign) => campaign.ngo)
  campaigns: Campaign[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  constructor(
    organizationName: string,
    cnpj: string,
    description: string,
    email: string,
    password: string,
    city: string,
    state: string,
    causes: string[],
    areas: string[],
    skills: string[],
    preferredCauses: string[],
  ) {
    this.organizationName = organizationName;
    this.cnpj = cnpj;
    this.description = description;
    this.email = email;
    this.password = password;
    this.city = city;
    this.state = state;
    this.causes = causes;
    this.areas = areas;
    this.skills = skills;
    this.preferredCauses = preferredCauses;
  }
}
