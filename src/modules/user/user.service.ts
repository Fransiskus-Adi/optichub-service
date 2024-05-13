import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/createUserDto.dto';
import { hash } from 'bcrypt'
import { UserDataDto } from './dto/response/UserDataDto.dto';
import { UpdateUserDto } from './dto/request/updateUserDto.dto';
// import { pagination } from '../pagination/pagination';
import { plainToClass } from 'class-transformer';
import { UserStatus } from 'src/enums/user-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async findAllUser(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    role?: string,
    status?: UserStatus | '',
  ): Promise<{
    data: UserDataDto[],
    metadata: {
      totalCount: number, currentPage: number, totalPages: number
    };
  }> {
    let whereCounditions: any = {};

    if (keyword) {
      whereCounditions.name = Like(`%${keyword}%`)
    }

    if (role) {
      whereCounditions.role = Like(`%${role}%`)
    }

    if (status !== undefined && status !== null && status !== '') {
      whereCounditions.status = status;
    }

    const [data, totalCount] = await this.userRepository.findAndCount({
      where: whereCounditions,
      take: limit,
      skip: (page - 1) * limit
    })

    const totalPages = Math.ceil(totalCount / limit);
    const userData = data.map(user => plainToClass(UserDataDto, user));

    return {
      data: userData,
      metadata: {
        totalCount,
        currentPage: page,
        totalPages,
      }
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async addUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const {
      name,
      email,
      dob,
      phone_number,
      password,
      status,
      role
    } = createUserDto;

    //Validate Existing Email
    const validateEmailExist = await this.userRepository.findOne({ where: { email } })
    if (validateEmailExist) {
      throw new Error('Email already exist!');
    }

    //Validate Existing Phone_Number
    const validatePhoneNumber = await this.userRepository.findOne({ where: { phone_number } })
    if (validatePhoneNumber) {
      throw new Error('Phone number already exist!');
    }

    // Parsed string to date
    const parsedDob = new Date(dob);
    // Hash input password
    const hashedPass = await hash(password, 10)

    const newUser = this.userRepository.create({
      name,
      email,
      dob: parsedDob,
      phone_number,
      password: hashedPass,
      status: UserStatus.ACTIVE,
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

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDataDto> {
    const userData = await this.userRepository.findOne(id);
    // Validate if the id was exist
    if (!userData) {
      throw new NotFoundException('User was not found !');
    }

    const validateName = await this.userRepository.findOne({ where: { email: updateUserDto.name } });
    if (validateName) {
      throw new Error('Name already exist!');
    }
    userData.name = updateUserDto.name;

    const validateEmail = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
    if (!validateEmail) {
      userData.email = updateUserDto.email;
    }
    userData.email = updateUserDto.email;

    const validatePhoneNumber = await this.userRepository.findOne({ where: { phone_number: updateUserDto.phone_number } });
    if (!validatePhoneNumber) {
      userData.phone_number = updateUserDto.phone_number;
    }

    if (updateUserDto.dob) {
      const parsedDob = new Date(updateUserDto.dob);
      if (isNaN(parsedDob.getTime())) {
        throw new BadRequestException('Invalid date format for dob field!');
      }
      userData.dob = parsedDob;
    }

    if (updateUserDto.password) {
      userData.password = await hash(updateUserDto.password, 10);
    }
    userData.status = updateUserDto.status;

    return await this.userRepository.save(userData);
  }

}
