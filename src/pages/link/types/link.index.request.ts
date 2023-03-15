import type { EnableType } from '@/types/EnableType';
import type { PaginationRequest } from '@/types/PaginationRequest';

export interface LinkIndexRequest extends PaginationRequest {
  url?: string;
  name?: string;
  status?: EnableType[];
}
