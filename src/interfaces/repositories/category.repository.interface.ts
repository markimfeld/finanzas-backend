import { CreateCategoryDto } from '../../dtos/createCategory.dto';
import { ICategory } from '../../models/category.model';

export interface ICategoryRepository {
    create(userId: string, dto: CreateCategoryDto): Promise<ICategory>;
    findById(categoryId: string): Promise<ICategory | null>;
}
