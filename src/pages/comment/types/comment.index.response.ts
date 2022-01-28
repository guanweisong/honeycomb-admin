import type { PaginationResponse } from '@/types/PaginationResponse';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';

export interface CommentIndexResponse extends PaginationResponse<CommentEntity[]> {}
