import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/request/createCategoryDto.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('/')
  async findAllCategory(@Res() res: Response): Promise<CategoryEntity[]> {
    try {
      const categoryList = await this.categoryService.findAllCategory();
      if (!categoryList || categoryList.length === 0) {
        res.status(404).json({ status: "error", message: "There's no data yet!" })
      }
      else {
        res.status(200).json({ status: 'success', statusCode: 200, data: categoryList });
        return categoryList;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
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
