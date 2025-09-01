import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private blacklistedTokens = new Set<string>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Gerar token JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      userType: user.userType,
    });

    return {
      message: 'Login successful',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      },
    };
  }

  logout(token: string): { message: string; userType: string; email: string } {
    if (!token) {
      throw new BadRequestException('No token provided');
    }

    try {
      // Verificar se o token é válido e extrair informações
      const payload = this.jwtService.verify(token);

      // Adicionar token à blacklist
      this.blacklistedTokens.add(token);

      return {
        message: 'Logout successful',
        userType: payload.userType,
        email: payload.email,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  validateToken(token: string): JwtPayload {
    try {
      const payload = this.jwtService.verify(token);

      // Verificar se o token está na blacklist
      if (this.isTokenBlacklisted(token)) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Método para verificar se um token é válido sem fazer logout
  validateTokenForLogout(token: string): JwtPayload {
    if (!token) {
      throw new BadRequestException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);

      // Verificar se o token está na blacklist
      if (this.isTokenBlacklisted(token)) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return payload;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
