export enum EnableType {
  DISABLE = 0, // 禁用
  ENABLE = 1, // 启用
}

export enum EnableTypeName {
  DISABLE = '禁用',
  ENABLE = '启用',
}

export const enableOptions = [
  {
    label: EnableTypeName.DISABLE,
    value: EnableType.DISABLE,
  },
  {
    label: EnableTypeName.ENABLE,
    value: EnableType.ENABLE,
  },
];
