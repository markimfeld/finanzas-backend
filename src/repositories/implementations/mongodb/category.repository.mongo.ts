import { CategoryModel, ICategory } from '../../../models/category.model';
import { ICategoryRepository } from '../../../interfaces/repositories/category.repository.interface';
import { CreateCategoryDto } from '../../../dtos/createCategory.dto';

export class CategoryRepositoryMongo implements ICategoryRepository {
    async create(user_id: string, dto: CreateCategoryDto): Promise<ICategory> {
        const category = await CategoryModel.create({ ...dto, userId: user_id });
        const { _id, userId, name, createdAt, updatedAt } = category.toObject();
        return { _id, userId, name, createdAt, updatedAt };
    }
    async findById(categoryId: string): Promise<ICategory | null> {
        return await CategoryModel.findById(categoryId).lean<ICategory>(); // Usás .lean() para devolver POJO
    }
}
