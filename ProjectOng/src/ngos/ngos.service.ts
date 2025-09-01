import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Ngo } from './entities/ngo.entity';
import { CreateNgoDto } from './dto/create-ngo.dto';
import { LoginNgoDto } from './dto/login-ngo.dto';

@Injectable()
export class NgosService {
  constructor(
    @InjectRepository(Ngo)
    private readonly ngosRepository: Repository<Ngo>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createNgoDto: CreateNgoDto): Promise<Ngo> {
    try {
      // Verificar se já existe ONG com este email
      const existingNgoByEmail = await this.ngosRepository.findOne({
        where: { email: createNgoDto.email },
      });

      if (existingNgoByEmail) {
        throw new ConflictException('Email already exists');
      }

      // Verificar se já existe ONG com este CNPJ
      const existingNgoByCnpj = await this.ngosRepository.findOne({
        where: { cnpj: createNgoDto.cnpj },
      });

      if (existingNgoByCnpj) {
        throw new ConflictException('CNPJ already exists');
      }

      // Hash da senha

      // Criar nova ONG
      const ngo = new Ngo(
        createNgoDto.organizationName,
        createNgoDto.cnpj,
        createNgoDto.description,
        createNgoDto.email,
        createNgoDto.password,
        createNgoDto.city,
        createNgoDto.state,
        createNgoDto.causes,
        createNgoDto.areas,
        createNgoDto.skills || [],
        createNgoDto.preferredCauses || [],
      );

      return await this.ngosRepository.save(ngo);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating NGO');
    }
  }

  async login({ email, password }: LoginNgoDto) {
    try {
      // Buscar ONG por email
      const ngo = await this.ngosRepository.findOne({
        where: { email },
      });

      if (!ngo) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = password === ngo.password;
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({
        sub: ngo.id,
        email: ngo.email,
        userType: 'ngo',
        organizationName: ngo.organizationName,
      });

      return {
        message: 'Login successful',
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during login');
    }
  }

  async findAll(causes?: string, city?: string, state?: string): Promise<Ngo[]> {
    try {
      if (causes) {
        const causesArray = causes.split(',').map((cause) => cause.trim());
        return await this.findByCauses(causesArray);
      }

      if (city || state) {
        return await this.findByLocation(city, state);
      }
      return await this.ngosRepository.find({
        select: ['id', 'organizationName', 'city', 'state', 'description', 'causes', 'areas', 'createdAt'],
      });
    } catch {
      throw new InternalServerErrorException('Error fetching NGOs');
    }
  }

  async findOne(id: string): Promise<Ngo> {
    try {
      const ngo = await this.ngosRepository.findOne({
        where: { id },
      });

      if (!ngo) {
        throw new NotFoundException('NGO not found');
      }

      return ngo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching NGO');
    }
  }

  async findByLocation(city?: string, state?: string): Promise<Ngo[]> {
    try {
      const queryBuilder = this.ngosRepository
        .createQueryBuilder('ngo')
        .select([
          'ngo.id',
          'ngo.organizationName',
          'ngo.city',
          'ngo.state',
          'ngo.description',
          'ngo.causes',
          'ngo.areas',
          'ngo.createdAt',
        ]);

      if (city) {
        queryBuilder.andWhere('ngo.city ILIKE :city', { city: `%${city}%` });
      }

      if (state) {
        queryBuilder.andWhere('ngo.state = :state', { state });
      }

      return await queryBuilder.getMany();
    } catch {
      throw new InternalServerErrorException('Error searching NGOs by location');
    }
  }

  async findByCauses(causes: string[]): Promise<Ngo[]> {
    try {
      return await this.ngosRepository
        .createQueryBuilder('ngo')
        .andWhere('ngo.causes && :causes', { causes })
        .select([
          'ngo.id',
          'ngo.organizationName',
          'ngo.city',
          'ngo.state',
          'ngo.description',
          'ngo.causes',
          'ngo.areas',
          'ngo.createdAt',
        ])
        .getMany();
    } catch {
      throw new InternalServerErrorException('Error searching NGOs by causes');
    }
  }
}
