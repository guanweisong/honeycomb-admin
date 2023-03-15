import moment from 'moment';
import { If } from 'tsx-control-statements/components';
import { Popconfirm } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import type { UserEntity } from '@/pages/user/types/user.entity';
import { UserStatus, userStatusOptions } from '@/pages/user/types/UserStatus';
import { UserLevel, userLevelOptions } from '@/pages/user/types/UserLevel';

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
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: true,
      search: false,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      search: false,
      render: (text, record) => (
        <p>
          <a onClick={() => props.handleEditItem(record)}>编辑</a>&nbsp;
          <If condition={record.level !== UserLevel.ADMIN && record.status !== UserStatus.DELETED}>
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => props.handleDeleteItem([record.id])}
            >
              <a>删除</a>
            </Popconfirm>
          </If>
        </p>
      ),
    },
  ] as ProColumns<UserEntity>[];
