import type { PaginationResponse } from '@/types/PaginationResponse';
import type { PageEntity } from '@/pages/page/types/page.entity';

export interface PageIndexListResponse extends PaginationResponse<PageEntity[]> {}
