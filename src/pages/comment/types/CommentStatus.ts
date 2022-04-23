export enum CommentStatus {
  TO_AUDIT = 0,
  PUBLISH = 1,
  RUBBISH = 2,
  BAN = 3,
}

export enum CommentStatusName {
  TO_AUDIT = '待审核',
  PUBLISH = '已发布',
  RUBBISH = '垃圾评论',
  BAN = '已发布',
}

export const commentStatusOptions = [
  {
    label: CommentStatusName.TO_AUDIT,
    value: CommentStatus.TO_AUDIT,
  },
  {
    label: CommentStatusName.PUBLISH,
    value: CommentStatus.PUBLISH,
  },
  {
    label: CommentStatusName.RUBBISH,
    value: CommentStatus.RUBBISH,
  },
  {
    label: CommentStatusName.BAN,
    value: CommentStatus.BAN,
  },
];
