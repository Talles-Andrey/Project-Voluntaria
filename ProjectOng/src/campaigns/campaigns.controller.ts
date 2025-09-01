import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateDonationDto } from '../donations/dto/create-donation.dto';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { NgoAuthGuard } from 'src/auth/ngo-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('campaigns')
@ApiTags('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(NgoAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new campaign (ONG only)' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully', type: Campaign })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateCampaignDto })
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Campaign> {
    const ngoId = user.sub;
    return await this.campaignsService.create(createCampaignDto, ngoId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Campaigns fetched successfully', type: [Campaign] })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by title' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  async findAll(
    @Query('title') title?: string,
    @Query('category') category?: 'campaign' | 'opportunity',
    @Query('status') status?: 'active' | 'completed' | 'cancelled',
  ): Promise<Campaign[]> {
    return await this.campaignsService.findAll(title, category, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by id' })
  @ApiResponse({ status: 200, description: 'Campaign fetched successfully', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findOne(@Param('id') id: string): Promise<Campaign> {
    return await this.campaignsService.findOne(id);
  }

  @Post(':id/donate')
  @ApiOperation({ summary: 'Make a donation to a campaign' })
  @ApiResponse({ status: 201, description: 'Donation made successfully', type: Campaign })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async donate(@Param('id') id: string, @Body() createDonationDto: CreateDonationDto): Promise<void> {
    return await this.campaignsService.donate(id, createDonationDto);
  }
}
