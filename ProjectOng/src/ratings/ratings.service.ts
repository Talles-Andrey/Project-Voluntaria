import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private readonly ratingsRepository: Repository<Rating>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Project) private readonly projectsRepository: Repository<Project>,
  ) {}

  async create({ projectId, score, comment, userId }: CreateRatingDto): Promise<Rating> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const project = await this.projectsRepository.findOne({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const rating = new Rating(userId, score, comment, projectId);

      return await this.ratingsRepository.save(rating);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating rating');
    }
  }

  async getRacingByUser(userId: string): Promise<Rating[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.ratingsRepository.find({ where: { userId } });
  }

  async getRacingByProject(projectId: string): Promise<Rating[]> {
    const project = await this.projectsRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return await this.ratingsRepository.find({ where: { projectId: projectId } });
  }
}
