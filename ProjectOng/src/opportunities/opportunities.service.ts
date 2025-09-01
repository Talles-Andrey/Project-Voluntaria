import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { Repository } from 'typeorm';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Ngo } from 'src/ngos/entities/ngo.entity';

export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity) private readonly opportunitiesRepository: Repository<Opportunity>,
    @InjectRepository(Ngo) private readonly ngosRepository: Repository<Ngo>,
  ) {}

  async create(
    { title, description, location, cause, startDate, endDate, maxVolunteers }: CreateOpportunityDto,
    ngoId: string,
  ): Promise<Opportunity> {
    try {
      const opportunityExists = await this.opportunitiesRepository.findOne({ where: { title } });

      if (opportunityExists) {
        throw new BadRequestException('Opportunity already exists');
      }

      const ngo = await this.ngosRepository.findOne({ where: { id: ngoId } });
      if (!ngo) {
        throw new NotFoundException('NGO not found');
      }

      const opportunity = new Opportunity(
        title,
        description,
        location,
        cause,
        new Date(startDate),
        new Date(endDate),
        maxVolunteers,
        ngoId,
      );

      return this.opportunitiesRepository.save(opportunity);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating opportunity');
    }
  }

  async findAll(cause?: string, location?: string, status?: string): Promise<Opportunity[]> {
    try {
      return this.opportunitiesRepository.find({
        where: { cause, location, status: status as 'open' | 'closed' | 'completed' },
      });
    } catch {
      throw new InternalServerErrorException('Error fetching opportunities');
    }
  }

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunitiesRepository.findOne({ where: { id } });
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    return opportunity;
  }
  catch(error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Error fetching opportunity');
  }
}
