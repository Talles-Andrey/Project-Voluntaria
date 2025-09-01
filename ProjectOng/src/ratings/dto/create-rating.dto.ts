import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'ID do usuário que está fazendo a avaliação',
    example: 'uuid-do-usuario',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Nota da avaliação (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  score: number;

  @ApiProperty({
    description: 'Comentário da avaliação (opcional)',
    example: 'Excelente trabalho! Muito profissional.',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty({
    description: 'ID do projeto relacionado (opcional)',
    example: 'uuid-do-projeto',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  projectId: string;
}
