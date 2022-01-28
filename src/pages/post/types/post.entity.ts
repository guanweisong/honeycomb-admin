import type { EnableType } from '@/types/EnableType';
import type { PostStatus } from '@/pages/post/types/PostStatus';
import type { PostType } from '@/pages/post/types/PostType';

export interface TagReadOnly {
  _id: string;
  tag_name: string;
}

export interface UserReadOnly {
  _id: string;
  user_name: string;
}

export interface CategoryReadOnly {
  _id: string;
  category_title: string;
}

export interface MediaReadOnly {
  _id: string;
  media_url: string;
}

export interface PostEntity {
  _id: string;
  post_title?: string;
  post_content?: string;
  post_excerpt?: string;
  post_category: string | CategoryReadOnly;
  post_author: string | UserReadOnly;
  post_status: PostStatus;
  comment_status: EnableType;
  post_type: PostType;
  post_cover?: string | MediaReadOnly;
  movie_time?: string;
  movie_name_en?: string;
  movie_director?: string[] | TagReadOnly[];
  movie_actor?: string[] | TagReadOnly;
  movie_style?: string[] | TagReadOnly;
  gallery_location?: string;
  gallery_time?: string;
  gallery_style?: string[] | TagReadOnly[];
  quote_author?: string;
  quote_content?: string;
  post_views: number;
}
