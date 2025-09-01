import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { NgoAuthGuard } from './ngo-auth.guard';
import { LogoutAuthGuard } from './logout-auth.guard';
import { BlacklistInterceptor } from './blacklist.interceptor';
import { JwtAuthModule } from './jwt.module';

@Module({
  imports: [UsersModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    NgoAuthGuard,
    LogoutAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: BlacklistInterceptor,
    },
  ],
  exports: [AuthService, JwtAuthGuard, NgoAuthGuard, LogoutAuthGuard],
})
export class AuthModule {}
