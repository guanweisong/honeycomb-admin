export enum UserLevel {
  ADMIN = 1,
  EDITOR,
  GUEST,
}

export enum UserLevelName {
  ADMIN = '管理员',
  EDITOR = '编辑',
  GUEST = '游客',
}

export const userLevelOptions = [
  {
    label: UserLevelName.ADMIN,
    value: UserLevel.ADMIN,
  },
  {
    label: UserLevelName.EDITOR,
    value: UserLevel.EDITOR,
  },
  {
    label: UserLevelName.GUEST,
    value: UserLevel.GUEST,
  },
];
