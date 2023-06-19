import type { PaginationResponse } from '@/types/PaginationResponse';
import type { CommentEntity } from './comment.entity';

export interface CommentIndexResponse extends PaginationResponse<CommentEntity[]> {}
