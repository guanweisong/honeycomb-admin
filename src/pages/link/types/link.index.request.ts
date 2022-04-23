import type { EnableType } from '@/types/EnableType';
import type { PaginationRequest } from '@/types/PaginationRequest';

export interface LinkIndexRequest extends PaginationRequest {
  link_url?: string;
  link_name?: string;
  link_status?: EnableType[];
}
