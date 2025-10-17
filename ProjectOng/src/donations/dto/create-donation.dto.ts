import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDonationDto {
  @ApiProperty({
    description: 'Valor da doação',
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Nome do doador (opcional se for anônimo)',
    example: 'João Silva',
    required: false,
  })
  @IsString()
  @IsOptional()
  donorName?: string;

  @ApiProperty({
    description: 'Email do doador (opcional se for anônimo)',
    example: 'joao@email.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  donorEmail?: string;

  @ApiProperty({
    description: 'Mensagem do doador (opcional)',
    example: 'Que Deus abençoe este projeto!',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'Se a doação é anônima',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  anonymous: boolean;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID do usuário que está fazendo a doação (opcional)',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    required: false,
  })
  userId?: string;
}
