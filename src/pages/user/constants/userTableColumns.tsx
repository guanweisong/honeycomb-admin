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
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '级别',
      dataIndex: 'user_level',
      key: 'user_level',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: userLevelOptions,
      },
    },
    {
      title: '状态',
      dataIndex: 'user_status',
      key: 'user_status',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: userStatusOptions,
      },
    },
    {
      title: '用户邮箱',
      dataIndex: 'user_email',
      key: 'user_email',
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      defaultSortOrder: 'descend',
      search: false,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
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
          <If
            condition={
              record.user_level !== UserLevel.ADMIN && record.user_status !== UserStatus.DELETE
            }
          >
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => props.handleDeleteItem([record._id])}
            >
              <a>删除</a>
            </Popconfirm>
          </If>
        </p>
      ),
    },
  ] as ProColumns<UserEntity>[];
