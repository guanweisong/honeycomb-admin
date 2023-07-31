export enum CommentStatus {
  TO_AUDIT = 'TO_AUDIT',
  PUBLISH = 'PUBLISH',
  RUBBISH = 'RUBBISH',
  BAN = 'BAN',
}

export enum CommentStatusName {
  TO_AUDIT = '待审核',
  PUBLISH = '已发布',
  RUBBISH = '垃圾评论',
  BAN = '已屏蔽',
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
