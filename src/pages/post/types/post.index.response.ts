import type { PaginationResponse } from '@/types/PaginationResponse';
import type { PostEntity } from '@/pages/post/types/post.entity';

export interface PostIndexResponse extends PaginationResponse<PostEntity[]> {}
