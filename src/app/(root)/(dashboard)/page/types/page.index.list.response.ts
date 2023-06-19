import type { PaginationResponse } from '@/types/PaginationResponse';
import type { PageEntity } from './page.entity';

export interface PageIndexListResponse extends PaginationResponse<PageEntity[]> {}
