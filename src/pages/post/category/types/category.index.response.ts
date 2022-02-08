import type { PaginationResponse } from '@/types/PaginationResponse';
import type { CategoryEntity } from '@/pages/post/category/types/category.entity';

export interface CategoryIndexResponse extends PaginationResponse<CategoryEntity[]> {}
