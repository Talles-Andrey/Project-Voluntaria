import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { RatingsService } from './ratings.service';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthModule } from '../auth/jwt.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, User, Project]), JwtAuthModule],
  controllers: [RatingsController],
  providers: [RatingsService, JwtAuthGuard],
})
export class RatingsModule {}
