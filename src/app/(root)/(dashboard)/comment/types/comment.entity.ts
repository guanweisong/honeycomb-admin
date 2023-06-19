import type { BaseEntity } from '@/types/BaseEntity';
import type { CommentStatus } from './CommentStatus';

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
