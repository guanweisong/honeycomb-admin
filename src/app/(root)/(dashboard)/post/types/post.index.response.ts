import type { PaginationResponse } from '@/types/PaginationResponse';
import type { PostEntity } from './post.entity';

export interface PostIndexResponse extends PaginationResponse<PostEntity[]> {}
