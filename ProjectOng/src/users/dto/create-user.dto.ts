import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email do usuário (deve ser único)',
    example: 'joao.silva@email.com',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Cidade onde o usuário reside',
    example: 'São Paulo',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Estado onde o usuário reside (sigla de 2 letras)',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Tipo de usuário',
    example: 'volunteer',
    enum: ['volunteer', 'ngo'],
    default: 'volunteer',
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
