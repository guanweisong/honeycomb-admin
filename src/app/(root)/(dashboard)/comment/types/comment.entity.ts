import type { BaseEntity } from '@/types/BaseEntity';
import { MultiLang } from '@/types/MulitLang';
import type { CommentStatus } from './CommentStatus';

export interface CommentEntity extends BaseEntity {
  id: string;
  postId?: string;
  post?: {
    id: string;
    title: MultiLang;
  };
  pageId?: string;
  page?: {
    id: string;
    title: MultiLang;
  };
  customId: string;
  custom?: {
    id: string;
    title: MultiLang;
  };
  author: string;
  email: string;
  ip: string;
  content: string;
  status: CommentStatus;
  userAgent: string;
  parentId: string;
}
