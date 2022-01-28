export enum UserState {
  DELETE = -1,
  DISABLE,
  ENABLE,
}

export enum UserStateName {
  DELETE = '已删除',
  DISABLE = '禁用',
  ENABLE = '启用',
}

export const userStateOptions = [
  {
    label: UserStateName.DELETE,
    value: UserState.DELETE,
  },
  {
    label: UserStateName.DISABLE,
    value: UserState.DISABLE,
  },
  {
    label: UserStateName.ENABLE,
    value: UserState.ENABLE,
  },
];
