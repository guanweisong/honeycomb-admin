export enum PageStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  TO_AUDIT = 'TO_AUDIT',
}

export enum PageStatusName {
  PUBLISHED = '已发布',
  DRAFT = '草稿',
  TO_AUDIT = '待审核',
}

export const pageStatusOptions = [
  {
    label: PageStatusName.PUBLISHED,
    value: PageStatus.PUBLISHED,
  },
  {
    label: PageStatusName.DRAFT,
    value: PageStatus.DRAFT,
  },
  {
    label: PageStatusName.TO_AUDIT,
    value: PageStatus.TO_AUDIT,
  },
];
