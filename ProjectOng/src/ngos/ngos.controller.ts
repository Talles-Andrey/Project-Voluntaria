import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { NgosService } from './ngos.service';
import { CreateNgoDto } from './dto/create-ngo.dto';
import { LoginNgoDto } from './dto/login-ngo.dto';
import { Ngo } from './entities/ngo.entity';

@Controller('ngos')
@ApiTags('ngos')
export class NgosController {
  constructor(private readonly ngosService: NgosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new NGO' })
  @ApiResponse({ status: 201, description: 'NGO created successfully', type: Ngo })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createNgoDto: CreateNgoDto) {
    return await this.ngosService.create(createNgoDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login NGO' })
  @ApiResponse({ status: 200, description: 'Login successful', type: Ngo })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: LoginNgoDto })
  async login(@Body() loginNgoDto: LoginNgoDto) {
    return await this.ngosService.login(loginNgoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all NGOs with optional filters' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'state', required: false, description: 'Filter by state' })
  @ApiQuery({ name: 'causes', required: false, description: 'Filter by causes (comma-separated)' })
  @ApiResponse({ status: 200, description: 'NGOs fetched successfully', type: [Ngo] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('causes') causes?: string,
  ) {
    return await this.ngosService.findAll(causes, city, state);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get NGO by ID' })
  @ApiResponse({ status: 200, description: 'NGO fetched successfully', type: Ngo })
  @ApiResponse({ status: 404, description: 'NGO not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    return await this.ngosService.findOne(id);
  }
}
