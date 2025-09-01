import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesController } from './opportunities.controller';
import { Opportunity } from './entities/opportunity.entity';
import { OpportunitiesService } from './opportunities.service';
import { JwtAuthModule } from 'src/auth/jwt.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Ngo } from 'src/ngos/entities/ngo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity, Ngo]), JwtAuthModule],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, JwtAuthGuard],
})
export class OpportunitiesModule {}
