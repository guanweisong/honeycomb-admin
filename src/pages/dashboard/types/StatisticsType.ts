import type { PostType } from '@/pages/post/types/PostType';
import type { UserLevel } from '@/pages/user/types/UserLevel';
import type { CommentStatus } from '@/pages/comment/types/CommentStatus';

export interface StatisticsType {
  postType: {
    item: PostType;
    count: number;
  }[];
  userType: {
    item: UserLevel;
    count: number;
  }[];
  commentStatus: {
    item: CommentStatus;
    count: number;
  }[];
  userPost: {
    item: string;
    count: number;
  }[];
}
