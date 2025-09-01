import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { JwtAuthModule } from '../auth/jwt.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Enrollment]), JwtAuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtAuthGuard],
})
export class ProjectsModule {}
