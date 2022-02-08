import type { CommentStatus } from '@/pages/comment/types/CommentStatus';
import type { BaseEntity } from '@/types/BaseEntity';

export interface CommentEntity extends BaseEntity {
  _id: string;
  comment_post: string;
  comment_author: string;
  comment_email: string;
  comment_ip: string;
  comment_content: string;
  comment_status: CommentStatus;
  comment_agent: string;
  comment_parent: string;
}
