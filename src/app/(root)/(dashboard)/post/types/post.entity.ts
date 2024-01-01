import type { BaseEntity } from '@/types/BaseEntity';
import type { EnableType } from '@/types/EnableType';
import { MultiLang } from '@/types/MulitLang';
import type { PostStatus } from './PostStatus';
import type { PostType } from './PostType';

export interface TagReadOnly {
  id: string;
  name: MultiLang;
}

export interface UserReadOnly {
  id: string;
  name: string;
}

export interface CategoryReadOnly {
  id: string;
  title: MultiLang;
}

export interface MediaReadOnly {
  id: string;
  url: string;
}

export interface PostEntity extends BaseEntity {
  id: string;
  title?: MultiLang;
  content?: MultiLang;
  excerpt?: MultiLang;
  category: CategoryReadOnly;
  categoryId: string;
  author: UserReadOnly;
  status: PostStatus;
  commentStatus: EnableType;
  type: PostType;
  cover?: MediaReadOnly;
  coverId?: string;
  movieTime?: string;
  movieDirectors?: TagReadOnly[];
  movieDirectorIds?: string[];
  movieActors?: TagReadOnly[];
  movieActorIds?: string[];
  movieStyles?: TagReadOnly[];
  movieStyleIds?: string[];
  galleryLocation?: MultiLang;
  galleryTime?: string;
  galleryStyles?: TagReadOnly[];
  galleryStyleIds: string[];
  quoteAuthor?: MultiLang;
  quoteContent?: MultiLang;
  views: number;
}
