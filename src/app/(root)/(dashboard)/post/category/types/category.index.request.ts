import { PaginationRequest } from '@/types/PaginationRequest';

export interface CategoryIndexRequest extends PaginationRequest {
  title?: string;
  titleEn?: string;
}
