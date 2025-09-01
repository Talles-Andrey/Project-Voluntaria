import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { NgosService } from '../ngos/ngos.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: NgosService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logout', () => {
    it('should add token to blacklist and return user info', () => {
      const mockToken = 'valid.token.here';
      const mockPayload = {
        sub: 'user-id',
        email: 'user@example.com',
        userType: 'volunteer',
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);

      const result = service.logout(mockToken);

      expect(result).toEqual({
        message: 'Logout successful',
        userType: 'volunteer',
        email: 'user@example.com',
      });
      expect(service.isTokenBlacklisted(mockToken)).toBe(true);
    });

    it('should throw error for invalid token', () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.logout('invalid.token')).toThrow();
    });
  });
});
