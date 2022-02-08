import type { BaseResponse } from '@/types/BaseResponse';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';

export interface CommentCreateResponse extends BaseResponse<CommentEntity> {}
