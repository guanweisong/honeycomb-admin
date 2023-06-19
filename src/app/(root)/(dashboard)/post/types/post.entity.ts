import type { BaseEntity } from '@/types/BaseEntity';
import type { EnableType } from '@/types/EnableType';
import type { PostStatus } from './PostStatus';
import type { PostType } from './PostType';

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
  category: CategoryReadOnly;
  categoryId: string;
  author: UserReadOnly;
  status: PostStatus;
  commentStatus: EnableType;
  type: PostType;
  cover?: MediaReadOnly;
  coverId?: string;
  movieTime?: string;
  movieNameEn?: string;
  movieDirectors?: TagReadOnly[];
  movieDirectorIds?: string[];
  movieActors?: TagReadOnly[];
  movieActorIds?: string[];
  movieStyles?: TagReadOnly[];
  movieStyleIds?: string[];
  galleryLocation?: string;
  galleryTime?: string;
  galleryStyles?: TagReadOnly[];
  galleryStyleIds: string[];
  quoteAuthor?: string;
  quoteContent?: string;
  views: number;
}
