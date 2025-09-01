import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NgosService } from './ngos.service';
import { NgosController } from './ngos.controller';
import { Ngo } from './entities/ngo.entity';
import { JwtAuthModule } from '../auth/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ngo]), JwtAuthModule],
  controllers: [NgosController],
  providers: [NgosService],
  exports: [NgosService],
})
export class NgosModule {}
