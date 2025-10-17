import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create({
    name,
    email,
    password,
    city,
    state,
    userType,
    skills,
    experience,
    preferredCauses,
  }: CreateUserDto): Promise<User> {
    try {
      const user = new User(
        name,
        email,
        password,
        city,
        state,
        userType,
        skills,
        experience,
        preferredCauses,
      );

      const emailExists = await this.usersRepository.findOne({ where: { email } });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }

      return this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async update(
    id: string,
    { name, password, city, state, userType, skills, experience, preferredCauses }: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.name = name || user.name;
      user.password = password || user.password;
      user.city = city || user.city;
      user.state = state || user.state;
      user.userType = userType || user.userType;
      user.skills = skills || user.skills;
      user.experience = experience || user.experience;
      user.preferredCauses = preferredCauses || user.preferredCauses;

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async findAll(name?: string): Promise<User[]> {
    try {
      if (name) {
        return await this.usersRepository
          .createQueryBuilder('user')
          .where('user.name ILIKE :name', { name: `%${name}%` })
          .getMany();
      }
      return await this.usersRepository.find();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding users');
    }
  }
}
