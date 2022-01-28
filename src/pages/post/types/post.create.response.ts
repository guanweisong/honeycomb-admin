import type { BaseResponse } from '@/types/BaseResponse';
import type { PostEntity } from '@/pages/post/types/post.entity';

export interface PostCreateResponse extends BaseResponse<PostEntity> {}
