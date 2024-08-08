import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/createUserDto.dto';
import { hash, compare } from 'bcrypt'
import { UserDataDto } from './dto/response/UserDataDto.dto';
import { UpdateUserDto } from './dto/request/updateUserDto.dto';
// import { pagination } from '../pagination/pagination';
import { plainToClass } from 'class-transformer';
import { UserStatus } from 'src/enums/user-status.enum';
import { ChangePassDto } from './dto/request/changePassDto.dto';

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
      role,
      nik
    } = createUserDto;

    //Validate Existing Name
    const validateUserName = await this.userRepository.findOne({ where: { name } })
    if (validateUserName) {
      throw new BadRequestException('Name already exist!')
    }

    //Validate Existing Email
    const validateEmailExist = await this.userRepository.findOne({ where: { email } })
    if (validateEmailExist) {
      throw new BadRequestException('Email already exist!');
    }

    //Validate Existing Phone_Number
    const validatePhoneNumber = await this.userRepository.findOne({ where: { phone_number } })
    if (phone_number.charAt(0) !== '8') {
      throw new BadRequestException("Phone Number Must Start From 8!")
    }
    else if (phone_number.length < 10 || phone_number.length > 12) {
      throw new BadRequestException("Invalid phone number!")
    }
    else if (validatePhoneNumber) {
      throw new BadRequestException('Phone number already exist!');
    }

    // Validate NIK
    const validateNikNumber = await this.userRepository.findOne({ where: { nik } })
    if (validateNikNumber) {
      throw new BadRequestException('NIK number already exist');
    }

    if (nik.length > 16 || nik.length < 16) {
      throw new BadRequestException("Invalid NIK");
    }

    // Parsed string to date
    const parsedDob = new Date(dob);

    // Hash input password
    const hashedPass = await hash(password, 10)

    console.log('dto', createUserDto);
    const newUser = this.userRepository.create({
      name,
      email,
      dob: parsedDob,
      phone_number,
      password: hashedPass,
      status: UserStatus.ACTIVE,
      role,
      nik
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

    if (updateUserDto.name && updateUserDto.name !== userData.name) {
      const validateName = await this.userRepository.findOne({ where: { name: updateUserDto.name } });
      if (validateName) {
        throw new BadRequestException('Name already exist!');
      }
      userData.name = updateUserDto.name;
    }

    if (updateUserDto.email && updateUserDto.email !== userData.email) {
      const validateEmail = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if (validateEmail) {
        throw new BadRequestException('Email already exist!');
      }
      userData.email = updateUserDto.email;
    }

    const validatePhoneNumber = await this.userRepository.findOne({ where: { phone_number: updateUserDto.phone_number } });
    if (updateUserDto.phone_number && updateUserDto.phone_number !== userData.phone_number) {
      if (updateUserDto.phone_number.length < 10 || updateUserDto.phone_number.length > 12) {
        throw new BadRequestException("Invalid phone number!")
      } else if (updateUserDto.phone_number.charAt(0) !== '8') {
        throw new BadRequestException("Phone Must Number Start From 8!")
      }
      else if (validatePhoneNumber) {
        throw new BadRequestException('Phone number already exist!');
      }
      userData.phone_number = updateUserDto.phone_number;
    }
    const validateNikNumber = await this.userRepository.findOne({ where: { nik: updateUserDto.nik } })
    if (updateUserDto.nik && updateUserDto.nik !== userData.nik) {
      if (validateNikNumber) {
        throw new BadRequestException('NIK number already exist');
      }
      if (updateUserDto.nik.length > 16 || updateUserDto.nik.length < 16) {
        throw new BadRequestException("Invalid NIK");
      }
      userData.nik = updateUserDto.nik;
    }

    if (updateUserDto.dob) {
      const parsedDob = new Date(updateUserDto.dob);
      if (parsedDob !== userData.dob) {
        if (isNaN(parsedDob.getTime())) {
          throw new BadRequestException('Invalid date format for dob field!');
        }
        userData.dob = parsedDob;
      }
    }

    if (updateUserDto.password && updateUserDto.password !== userData.password) {
      userData.password = await hash(updateUserDto.password, 10);
    }
    userData.status = updateUserDto.status;

    userData.role = updateUserDto.role;

    console.log(userData)
    return await this.userRepository.save(userData);
  }

  async changePassword(id: string, changePassDto: ChangePassDto): Promise<UserDataDto> {
    const userData = await this.userRepository.findOne(id)

    if (!userData) {
      throw new NotFoundException("User Not Found!")
    }

    if (!changePassDto.oldPassword) {
      throw new BadRequestException("You Must Input Old Password")
    }

    const validateOldPassword = await compare(changePassDto.oldPassword, userData.password);
    if (!validateOldPassword) {
      throw new BadRequestException("Wrong Old Password")
    }

    if (!changePassDto.newPassword) {
      throw new BadRequestException("You Must Input New Password")
    }

    if (changePassDto.newPassword) {
      userData.password = await hash(changePassDto.newPassword, 10)
    }

    return await this.userRepository.save(userData);
  }
}
