import { Priority } from '../../enums/priority.enum';
import { ListQuery } from '../common/list-query.type';
import { CategoryEntity } from '../entities/category.entity';

export type CategoryItem = CategoryEntity;

export type ListCategoriesResponse = {
  categories: CategoryItem[];
  total: number;
};

export type ListCategoriesQuery = ListQuery & {
  createdAtFrom?: string;
  createdAtTo?: string;
  priorities?: Priority[];
};

export type CategoryDetail = CategoryItem & {};

export type DetailCategoryResponse = {
  category: CategoryDetail;
};

export type CreateCategoryBody = Pick<CategoryEntity, 'name' | 'priority'>;

export type UpdateCategoryBody = Partial<CreateCategoryBody>;
