import type { PaginationRequest } from '@/types/PaginationRequest';
import type { PostStatus } from './PostStatus';
import type { PostType } from './PostType';

export interface PostIndexRequest extends PaginationRequest {
  post_title?: string;
  post_type?: PostType[];
  post_status?: PostStatus[];
}
