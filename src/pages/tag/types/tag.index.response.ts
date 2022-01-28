import type { PaginationResponse } from '@/types/PaginationResponse';
import type { TagEntity } from '@/pages/tag/types/tag.entity';

export interface TagIndexResponse extends PaginationResponse<TagEntity[]> {}
