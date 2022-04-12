import { PaginationRequest } from '@/types/PaginationRequest';

export interface CategoryIndexRequest extends PaginationRequest {
  category_title?: string;
  category_title_en?: string;
}
