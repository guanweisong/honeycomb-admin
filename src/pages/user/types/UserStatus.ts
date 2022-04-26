export enum UserStatus {
  DELETE = -1,
  DISABLE = 0,
  ENABLE = 1,
}

export enum UserStatusName {
  DELETE = '已删除',
  DISABLE = '禁用',
  ENABLE = '启用',
}

export const userStatusOptions = [
  {
    label: UserStatusName.DELETE,
    value: UserStatus.DELETE.toString(),
  },
  {
    label: UserStatusName.DISABLE,
    value: UserStatus.DISABLE.toString(),
  },
  {
    label: UserStatusName.ENABLE,
    value: UserStatus.ENABLE.toString(),
  },
];
