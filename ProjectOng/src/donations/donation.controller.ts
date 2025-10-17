import { Controller, Get, Param } from '@nestjs/common';
import { DonationService } from './donation.service';
import { Donation } from './entities/donation.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('donations')
@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Get('/:userId')
  async findDonationsByUserId(@Param('userId') id: string): Promise<Donation[]> {
    return await this.donationService.findDonationsByUserId(id);
  }

  @Get('/:campaignId')
  async findDonationsByCampaignId(@Param('campaignId') id: string): Promise<Donation> {
    return await this.donationService.findDonationsByCampaignId(id);
  }
}
