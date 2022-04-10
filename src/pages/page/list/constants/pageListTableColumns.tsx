import { Popconfirm } from 'antd';
import { Link } from 'umi';
import moment from 'moment';
import { ProColumns } from '@ant-design/pro-table';
import type { PageEntity } from '@/pages/page/types/page.entity';
import { PageStatusName, pageStatusOptions, PageStatus } from '@/pages/page/types/PageStatus';

export interface PageListTableColumnsProps {
  handleDeleteItem: (ids: string[]) => void;
  page_status: PageStatus[];
}

export const pageListTableColumns = (props: PageListTableColumnsProps) =>
  [
    {
      title: '文章名称',
      dataIndex: 'page_title',
      key: 'page_title',
    },
    {
      title: '作者',
      dataIndex: 'page_author',
      key: 'page_author',
      search: false,
      render: (text) => text.user_name,
    },
    {
      title: '状态',
      dataIndex: 'page_status',
      key: 'page_status',
      filters: pageStatusOptions.map((item) => ({ text: item.label, value: item.value })),
      filteredValue: props.page_status,
      search: false,
      render: (text: PageStatus) => PageStatusName[PageStatus[text] as keyof typeof PageStatusName],
    },
    {
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
      search: false,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      search: false,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '点击量',
      dataIndex: 'page_views',
      key: 'page_views',
      search: false,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      search: false,
      render: (text, record) => (
        <p>
          <Link to={`/page/edit?_id=${record._id}`}>编辑</Link>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record._id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ProColumns<PageEntity>[];
