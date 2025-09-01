import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginResponseEntity } from './entities/login-response.entity';
import { LogoutResponseEntity } from './entities/logout-response.entity';
import { LogoutAuthGuard } from './logout-auth.guard';
import type { Request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LogoutAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user or NGO' })
  @ApiResponse({ status: 200, description: 'Logout successful', type: LogoutResponseEntity })
  @ApiResponse({ status: 400, description: 'Bad Request - No token provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Invalid user type' })
  logout(@Req() request: Request): LogoutResponseEntity {
    // Extrair o token do header Authorization
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    return this.authService.logout(token);
  }
}
