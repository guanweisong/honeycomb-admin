import type { CommentStatus } from '@/pages/comment/types/CommentStatus';
import type { BaseEntity } from '@/types/BaseEntity';

export interface CommentEntity extends BaseEntity {
  id: string;
  postId: string;
  author: string;
  email: string;
  ip: string;
  content: string;
  status: CommentStatus;
  userAgent: string;
  parentId: string;
}
