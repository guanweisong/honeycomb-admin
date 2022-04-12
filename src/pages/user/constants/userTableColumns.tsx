import moment from 'moment';
import { If } from 'tsx-control-statements/components';
import { Popconfirm } from 'antd';
import { ProColumns } from '@ant-design/pro-table';
import type { UserEntity } from '@/pages/user/types/user.entity';
import { UserStatus, UserStatusName, userStatusOptions } from '@/pages/user/types/UserStatus';
import { UserLevel, UserLevelName, userLevelOptions } from '@/pages/user/types/UserLevel';

export interface userTableColumnsProps {
  handleEditItem: (record: UserEntity) => void;
  handleDeleteItem: (ids: string[]) => void;
  // user_status: UserStatus[];
  // user_level: UserLevel[];
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
      filters: userLevelOptions.map((item) => ({ text: item.label, value: item.value })),
      // filteredValue: props.user_level,
      search: false,
      render: (text: UserLevel) => UserLevelName[UserLevel[text] as keyof typeof UserLevelName],
    },
    {
      title: '状态',
      dataIndex: 'user_status',
      key: 'user_status',
      filters: userStatusOptions.map((item) => ({ text: item.label, value: item.value })),
      // filteredValue: props.user_status,
      search: false,
      render: (text: UserStatus) => UserStatusName[UserStatus[text] as keyof typeof UserStatusName],
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
