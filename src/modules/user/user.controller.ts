import { Controller, Get, Post, Body, HttpException, HttpStatus, Query, Delete, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/request/createUserDto.dto';
import { FindAllUserDto } from './dto/response/findAllUserDto.dto';
import { UpdateUserDto } from './dto/request/updateUserDto.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/')
  async findAllUser(): Promise<FindAllUserDto[]> {
    try {
      const users = await this.userService.findAllUsers();
      if (!users || users.length === 0) {
        throw new HttpException('No User Found!', HttpStatus.NOT_FOUND)
      }
      return users;
    } catch (error) {
      console.log(error)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('/add-user')
  async addUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.addUser(createUserDto);
  }

  @Get('/search')
  async findByUsername(@Query('name') name?: string): Promise<UserEntity> {
    return await this.userService.findByName(name);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteUser(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<FindAllUserDto> {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
