import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { DonationsModule } from './donations/donations.module';
import { RatingsModule } from './ratings/ratings.module';
import { dataSourceOptions } from './database/database-provider';
import { NgosModule } from './ngos/ngos.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    ProjectsModule,
    CampaignsModule,
    DonationsModule,
    RatingsModule,
    NgosModule,
    OpportunitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
