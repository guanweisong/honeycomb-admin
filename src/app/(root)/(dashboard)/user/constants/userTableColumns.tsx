import type { ProColumns } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { UserLevel, userLevelOptions } from '../types/UserLevel';
import { UserStatus, userStatusOptions } from '../types/UserStatus';
import type { UserEntity } from '../types/user.entity';

export interface userTableColumnsProps {
  handleEditItem: (record: UserEntity) => void;
  handleDeleteItem: (ids: string[]) => void;
}

export const userTableColumns = (props: userTableColumnsProps) =>
  [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: userLevelOptions,
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: userStatusOptions,
      },
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      defaultSortOrder: 'desc',
      search: false,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: true,
      search: false,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      search: false,
      render: (text, record) => (
        <p>
          <a onClick={() => props.handleEditItem(record)}>编辑</a>&nbsp;
          {record.level !== UserLevel.ADMIN && record.status !== UserStatus.DELETED && (
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => props.handleDeleteItem([record.id])}
            >
              <a>删除</a>
            </Popconfirm>
          )}
        </p>
      ),
    },
  ] as ProColumns<UserEntity>[];
