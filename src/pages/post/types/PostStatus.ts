export enum PostStatus {
  PUBLISHED = 0,
  DRAFT = 1,
  TO_AUDIT = 2,
}

export enum PostStatusName {
  PUBLISHED = '已发布',
  DRAFT = '草稿',
  TO_AUDIT = '待审核',
}

export const postStatusOptions = [
  {
    label: PostStatusName.PUBLISHED,
    value: PostStatus.PUBLISHED.toString(),
  },
  {
    label: PostStatusName.DRAFT,
    value: PostStatus.DRAFT.toString(),
  },
  {
    label: PostStatusName.TO_AUDIT,
    value: PostStatus.TO_AUDIT.toString(),
  },
];
