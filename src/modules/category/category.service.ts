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

  async findAllCategory(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: CategoryEntity[],
    metadata: {
      totalCount: number, currentPage: number, totalPages: number
    }
  }> {
    const [data, totalCount] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit
    })

    const totalPages = Math.ceil(totalCount / limit)
    return {
      data: data,
      metadata: {
        totalCount, currentPage: page, totalPages
      }
    }
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
