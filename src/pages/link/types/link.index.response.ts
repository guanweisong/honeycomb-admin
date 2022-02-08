import type { PaginationResponse } from '@/types/PaginationResponse';
import type { LinkEntity } from '@/pages/link/types/link.entity';

export interface LinkIndexResponse extends PaginationResponse<LinkEntity[]> {}
