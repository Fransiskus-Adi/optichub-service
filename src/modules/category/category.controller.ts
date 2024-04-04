import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/request/createCategoryDto.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('/')
  async findAllCategory(): Promise<CategoryEntity[]> {
    try {
      const categoryList = await this.categoryService.findAllCategory();
      if (!categoryList || categoryList.length === 0) {
        throw new NotFoundException("Theres no data!");
      }
      return categoryList;
    } catch (error) {
      console.error(error);
      throw new error;
    }
  }

  @Get('/search')
  async findCategoryId(@Query('id') id?: string): Promise<CategoryEntity> {
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
