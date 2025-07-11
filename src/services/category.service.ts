import { CreateCategoryDto } from '../dtos/createCategory.dto';
import { ICategory } from '../models/category.model';
import { ICategoryRepository } from '../interfaces/repositories/category.repository.interface';

export class CategoryService {
    constructor(private categoryRepository: ICategoryRepository) { }

    async createCategory(userId: string, dto: CreateCategoryDto): Promise<ICategory> {

        return await this.categoryRepository.create(userId, dto);
    }
}
