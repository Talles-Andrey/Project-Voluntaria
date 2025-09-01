import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty({
    description: 'Título da oportunidade',
    example: 'Ajudar em projeto de reflorestamento',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da oportunidade',
    example: 'Projeto de reflorestamento na região de Mata Atlântica...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Localização da oportunidade',
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
    description: 'Data de início',
    example: '2024-02-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Data de término',
    example: '2024-02-28',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Número máximo de voluntários',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  maxVolunteers: number;
}
