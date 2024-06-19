import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, Res, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/request/createCategoryDto.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('/')
  async findAllCategory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: CategoryEntity[],
    metadata: {
      totalCount: number, currentPage: number, totalPages: number
    }
  }> {
    try {
      return this.categoryService.findAllCategory(page, limit)
    } catch (error) {
      console.error(error);
      throw new error;
    }
  }

  @Get(':id')
  async findCategoryId(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoryService.findCategoryById(id);
  }

  @Post('/add-category')
  async addCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.addCategory(createCategoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return await this.categoryService.deleteCategory(id);
  }

}
