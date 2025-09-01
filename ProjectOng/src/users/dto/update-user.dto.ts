import { IsOptional, IsString, IsIn, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Cidade onde o usuário reside',
    example: 'São Paulo',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Estado onde o usuário reside (sigla de 2 letras)',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
    required: false,
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'Tipo de usuário',
    example: 'volunteer',
    enum: ['volunteer', 'ngo'],
    required: false,
  })
  @IsString()
  @IsIn(['volunteer', 'ngo'])
  @IsOptional()
  userType?: 'volunteer' | 'ngo';

  @ApiProperty({
    description: 'Habilidades do voluntário (opcional)',
    example: ['Organização', 'Comunicação', 'Trabalho em equipe'],
    required: false,
    type: [String],
  })
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    description: 'Experiência do voluntário (opcional)',
    example: '2 anos em projetos sociais',
    required: false,
  })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiProperty({
    description: 'Causas preferidas (opcional)',
    example: ['Educação', 'Meio ambiente', 'Saúde'],
    required: false,
    type: [String],
  })
  @IsOptional()
  preferredCauses?: string[];
}
