import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/request/createCategoryDto.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) { }

  async findAllCategory(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async findCategoryById(id: string): Promise<CategoryEntity> {
    return await this.categoryRepository.findOne(id)
  }

  async addCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  async deleteCategory(id: string): Promise<any> {
    try {
      return await this.categoryRepository.softDelete(id);
    } catch (error) {
      throw new NotFoundException('Id not found!');
    }
  }

}
