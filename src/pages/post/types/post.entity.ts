import type { EnableType } from '@/types/EnableType';
import type { PostStatus } from '@/pages/post/types/PostStatus';
import type { PostType } from '@/pages/post/types/PostType';
import type { BaseEntity } from '@/types/BaseEntity';

export interface TagReadOnly {
  id: string;
  name: string;
}

export interface UserReadOnly {
  id: string;
  name: string;
}

export interface CategoryReadOnly {
  id: string;
  title: string;
}

export interface MediaReadOnly {
  id: string;
  url: string;
}

export interface PostEntity extends BaseEntity {
  id: string;
  title?: string;
  content?: string;
  excerpt?: string;
  category: string | CategoryReadOnly;
  author: string | UserReadOnly;
  status: PostStatus;
  commentStatus: EnableType;
  type: PostType;
  cover?: string | MediaReadOnly;
  movieTime?: string;
  movieNameEn?: string;
  movieDirector?: string[] | TagReadOnly[];
  movieActor?: string[] | TagReadOnly;
  movieStyle?: string[] | TagReadOnly;
  galleryLocation?: string;
  galleryTime?: string;
  galleryStyle?: string[] | TagReadOnly[];
  quoteAuthor?: string;
  quoteContent?: string;
  views: number;
}
