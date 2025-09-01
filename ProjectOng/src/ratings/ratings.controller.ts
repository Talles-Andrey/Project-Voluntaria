import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';

@Controller('ratings')
@ApiTags('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a rating' })
  @ApiResponse({ status: 201, description: 'Rating created successfully', type: Rating })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateRatingDto })
  async create(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingsService.create(createRatingDto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get ratings for a specific user' })
  @ApiResponse({ status: 200, description: 'Ratings fetched successfully', type: [Rating] })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserRatings(@Param('id') id: string): Promise<Rating[]> {
    return await this.ratingsService.getRacingByUser(id);
  }

  @Get('ong/:id')
  @ApiOperation({ summary: 'Get ratings for a specific NGO' })
  @ApiResponse({ status: 200, description: 'Ratings fetched successfully', type: [Rating] })
  @ApiResponse({ status: 404, description: 'NGO not found' })
  async getNgoRatings(@Param('id') id: string): Promise<Rating[]> {
    return await this.ratingsService.getRacingByProject(id);
  }
}
