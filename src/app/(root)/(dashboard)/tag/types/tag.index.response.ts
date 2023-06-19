import type { PaginationResponse } from '@/types/PaginationResponse';
import type { TagEntity } from './tag.entity';

export interface TagIndexResponse extends PaginationResponse<TagEntity[]> {}
