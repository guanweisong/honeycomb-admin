import type { ProColumns } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import type { UserReadOnly } from '../../../post/types/post.entity';
import { pageStatusOptions } from '../../types/PageStatus';
import type { PageEntity } from '../../types/page.entity';

export interface PageListTableColumnsProps {
  handleDeleteItem: (ids: string[]) => void;
}

export const pageListTableColumns = (props: PageListTableColumnsProps) =>
  [
    {
      title: '文章名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      search: false,
      render: (text: UserReadOnly) => text.name,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: pageStatusOptions,
      },
    },
    {
      title: '发表时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      search: false,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      search: false,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '点击量',
      dataIndex: 'views',
      key: 'views',
      search: false,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      search: false,
      render: (text, record) => (
        <p>
          <Link href={`/page/edit?id=${record.id}`}>编辑</Link>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record.id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ProColumns<PageEntity>[];
