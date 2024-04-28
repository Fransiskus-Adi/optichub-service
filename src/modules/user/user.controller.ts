import { Controller, Get, Post, Body, HttpException, HttpStatus, Query, Delete, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/request/createUserDto.dto';
import { UserDataDto } from './dto/response/UserDataDto.dto';
import { UpdateUserDto } from './dto/request/updateUserDto.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/')
  async findAllUser(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('role') role?: string,
    @Query('status') status?: boolean
  ): Promise<{ data: UserDataDto[], totalCount: number }> {
    try {
      return await this.userService.findAllUser(page, limit, keyword, role, status)
    } catch (error) {
      console.log(error)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('/')
  async addUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.addUser(createUserDto);
  }

  @Get('/:id')
  async getUserById(@Param() id?: string): Promise<UserEntity> {
    return await this.userService.getUserById(id);
  }

  @Get('/search')
  async findByEmail(@Query('email') email?: string): Promise<UserEntity> {
    return await this.userService.findByEmail(email);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteUser(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDataDto> {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
