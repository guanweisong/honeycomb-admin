export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  TO_AUDIT = 'TO_AUDIT',
}

export enum PostStatusName {
  PUBLISHED = '已发布',
  DRAFT = '草稿',
  TO_AUDIT = '待审核',
}

export const postStatusOptions = [
  {
    label: PostStatusName.PUBLISHED,
    value: PostStatus.PUBLISHED,
  },
  {
    label: PostStatusName.DRAFT,
    value: PostStatus.DRAFT,
  },
  {
    label: PostStatusName.TO_AUDIT,
    value: PostStatus.TO_AUDIT,
  },
];
