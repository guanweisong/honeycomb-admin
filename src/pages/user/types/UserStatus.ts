export enum UserStatus {
  DELETED = 'DELETED',
  DISABLE = 'DISABLE',
  ENABLE = 'ENABLE',
}

export enum UserStatusName {
  DELETED = '已删除',
  DISABLE = '禁用',
  ENABLE = '启用',
}

export const userStatusOptions = [
  {
    label: UserStatusName.DELETED,
    value: UserStatus.DELETED,
  },
  {
    label: UserStatusName.DISABLE,
    value: UserStatus.DISABLE,
  },
  {
    label: UserStatusName.ENABLE,
    value: UserStatus.ENABLE,
  },
];
