import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { OpportunitiesService } from './opportunities.service';
import { Opportunity } from './entities/opportunity.entity';
import { NgoAuthGuard } from 'src/auth/ngo-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('opportunities')
@ApiTags('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @UseGuards(NgoAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new volunteer opportunity' })
  @ApiResponse({ status: 201, description: 'Opportunity created successfully', type: Opportunity })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateOpportunityDto })
  async create(
    @Body() createOpportunityDto: CreateOpportunityDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Opportunity> {
    const ngoId = user.sub;
    return await this.opportunitiesService.create(createOpportunityDto, ngoId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all opportunities with optional filters' })
  @ApiQuery({ name: 'cause', required: false, description: 'Filter by cause type' })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Opportunities fetched successfully', type: [Opportunity] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(
    @Query('cause') cause?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ): Promise<Opportunity[]> {
    return await this.opportunitiesService.findAll(cause, location, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity by id' })
  @ApiResponse({ status: 200, description: 'Opportunity fetched successfully', type: Opportunity })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string): Promise<Opportunity> {
    return await this.opportunitiesService.findOne(id);
  }
}
