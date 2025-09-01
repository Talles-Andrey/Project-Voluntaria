import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the project' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The status of the enrollment' })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The notes of the enrollment' })
  notes?: string;
}
