import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Título da campanha',
    example: 'Ajude crianças carentes',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descrição da campanha',
    example: 'Campanha para arrecadar fundos para crianças carentes...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Meta de arrecadação',
    example: 10000.0,
  })
  @IsNumber()
  @IsNotEmpty()
  goalAmount: number;

  @ApiProperty({
    description: 'Data de início da campanha',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Data de término da campanha',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Categoria da campanha',
    example: 'campaign',
  })
  @IsString()
  @IsNotEmpty()
  category: 'campaign' | 'opportunity';
}
