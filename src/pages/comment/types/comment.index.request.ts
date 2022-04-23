import type { PaginationRequest } from '@/types/PaginationRequest';
import type { CommentStatus } from './CommentStatus';

export interface CommentIndexRequest extends PaginationRequest {
  comment_status?: CommentStatus[];
}
