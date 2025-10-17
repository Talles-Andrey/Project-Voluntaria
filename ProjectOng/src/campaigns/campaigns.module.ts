import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsController } from './campaigns.controller';
import { Campaign } from './entities/campaign.entity';
import { CampaignsService } from './campaigns.service';
import { Donation } from 'src/donations/entities/donation.entity';
import { JwtAuthModule } from 'src/auth/jwt.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Donation, User]), JwtAuthModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, JwtAuthGuard],
})
export class CampaignsModule {}
