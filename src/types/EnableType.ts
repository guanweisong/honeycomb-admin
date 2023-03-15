export enum EnableType {
  DISABLE = 'DISABLE', // 禁用
  ENABLE = 'ENABLE', // 启用
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
