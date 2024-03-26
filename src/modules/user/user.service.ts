import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/createUserDto.dto';
import { hash } from 'bcrypt'
import { FindAllUserDto } from './dto/response/findAllUserDto.dto';
import { UpdateUserDto } from './dto/request/updateUserDto.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async findAllUsers(): Promise<FindAllUserDto[]> {
    const users = await this.userRepository.find();
    const data = users.map(user => ({
      name: user.name,
      email: user.email,
      dob: user.dob,
      phone_number: user.phone_number,
      role: user.role
    }))
    return data;
  }

  async findByName(name: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async addUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const {
      name,
      email,
      dob,
      phone_number,
      password,
      role
    } = createUserDto;

    const parsedDob = new Date(dob);
    const hashedPass = await hash(password, 10)

    const newUser = this.userRepository.create({
      name,
      email,
      dob: parsedDob,
      phone_number,
      password: hashedPass,
      role
    })

    return await this.userRepository.save(newUser);
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await this.userRepository.softDelete(id);
    } catch (error) {
      throw new NotFoundException('Id not found !');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<FindAllUserDto> {
    const userData = await this.userRepository.findOne(id);
    if (!userData) {
      throw new NotFoundException('User was not found !');
    }
    if (updateUserDto.email) {
      userData.email = updateUserDto.email;
    }
    if (updateUserDto.password) {
      userData.password = await hash(updateUserDto.password, 10);
    }
    if (updateUserDto.phone_number) {
      userData.phone_number = updateUserDto.phone_number;
    }

    return await this.userRepository.save(userData);
  }

}
