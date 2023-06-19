import type { BaseResponse } from '@/types/BaseResponse';
import type { CommentEntity } from './comment.entity';

export interface CommentCreateResponse extends BaseResponse<CommentEntity> {}
