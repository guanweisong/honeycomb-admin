import type { CommentStatus } from '../../comment/types/CommentStatus';
import type { PostType } from '../../post/types/PostType';
import type { UserLevel } from '../../user/types/UserLevel';

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
