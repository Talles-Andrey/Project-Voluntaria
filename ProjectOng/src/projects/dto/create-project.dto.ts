import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Título do projeto',
    example: 'Ajudar em projeto de reflorestamento',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada do projeto',
    example: 'Projeto de reflorestamento na região de Mata Atlântica...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Localização do projeto',
    example: 'São Paulo, SP',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Tipo de causa',
    example: 'Meio ambiente',
  })
  @IsString()
  @IsNotEmpty()
  cause: string;

  @ApiProperty({
    description: 'Data de início (formato: YYYY-MM-DD)',
    example: '2024-02-01',
  })
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'Data de término (formato: YYYY-MM-DD)',
    example: '2024-02-28',
  })
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    description: 'Número máximo de voluntários',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  maxVolunteers: number;
}
