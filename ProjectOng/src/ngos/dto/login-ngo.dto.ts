import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginNgoDto {
  @ApiProperty({
    description: 'Email da ONG',
    example: 'contato@ongexemplo.org',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha da ONG',
    example: 'senha123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
