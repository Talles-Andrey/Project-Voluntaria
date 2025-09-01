import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

// DTO para criar ONG
export class CreateNgoDto {
  @ApiProperty({
    description: 'Nome da organização',
    example: 'ONG Exemplo',
  })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({
    description: 'CNPJ da organização',
    example: '12.345.678/0001-90',
  })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({
    description: 'Descrição da organização',
    example: 'Organização sem fins lucrativos dedicada à educação',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Email da organização',
    example: 'contato@ongexemplo.org',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha da organização',
    example: 'senha123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Cidade da organização',
    example: 'São Paulo',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Estado da organização',
    example: 'SP',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'Causas apoiadas pela organização',
    type: [String],
    example: ['Educação', 'Saúde', 'Meio Ambiente'],
  })
  @IsArray()
  @IsNotEmpty()
  causes: string[];

  @ApiProperty({
    description: 'Áreas de atuação da organização',
    type: [String],
    example: ['Assistência Social', 'Capacitação Profissional'],
  })
  @IsArray()
  @IsNotEmpty()
  areas: string[];

  @ApiProperty({
    description: 'Habilidades da organização (opcional)',
    type: [String],
    required: false,
    example: ['Gestão de Projetos', 'Captação de Recursos'],
  })
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    description: 'Causas preferidas para parcerias (opcional)',
    type: [String],
    required: false,
    example: ['Educação Infantil', 'Sustentabilidade'],
  })
  @IsArray()
  @IsOptional()
  preferredCauses?: string[];
}
