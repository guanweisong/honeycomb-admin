import moment from 'moment';
import { Link } from 'umi';
import { ProColumns } from '@ant-design/pro-table';
import { Popconfirm } from 'antd';
import type { CategoryReadOnly, PostEntity, UserReadOnly } from '@/pages/post/types/post.entity';
import { PostType, postTypeOptions, PostTypeName } from '@/pages/post/types/PostType';
import { PostStatus, PostStatusName, postStatusOptions } from '@/pages/post/types/PostStatus';

export interface PostListTableColumnsProps {
  // post_type: PostType[];
  // post_status: PostStatus[];
  handleDeleteItem: (id: string[]) => void;
}

export const PostListTableColumns = (props: PostListTableColumnsProps) =>
  [
    {
      title: '文章名称',
      dataIndex: 'post_title',
      key: 'post_title',
      width: 200,
    },
    {
      title: '引用内容',
      dataIndex: 'quote_content',
      key: 'quote_content',
      search: false,
      width: 200,
    },
    {
      title: '分类',
      dataIndex: 'post_category',
      key: 'post_category',
      search: false,
      width: 60,
      render: (text: CategoryReadOnly) => text.category_title,
    },
    {
      title: '类型',
      dataIndex: 'post_type',
      key: 'post_type',
      filters: postTypeOptions.map((item) => ({ text: item.label, value: item.value })),
      // filteredValue: props.post_type,
      search: false,
      width: 70,
      render: (text: PostType) => PostTypeName[PostType[text] as keyof typeof PostTypeName],
    },
    {
      title: '作者',
      dataIndex: 'post_author',
      key: 'post_author',
      search: false,
      width: 80,
      render: (text: UserReadOnly) => text.user_name,
    },
    {
      title: '状态',
      dataIndex: 'post_status',
      key: 'post_status',
      filters: postStatusOptions.map((item) => ({ text: item.label, value: item.value })),
      // filteredValue: props.post_status,
      search: false,
      width: 70,
      render: (text: PostStatus) => PostStatusName[PostStatus[text] as keyof typeof PostStatusName],
    },
    {
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      defaultSortOrder: 'descend',
      search: false,
      width: 180,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: true,
      search: false,
      width: 180,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '点击量',
      dataIndex: 'post_views',
      key: 'post_views',
      search: false,
      sorter: true,
      width: 80,
    },
    {
      title: '操作',
      key: 'operation',
      search: false,
      width: 80,
      fixed: 'right',
      render: (text, record) => (
        <p>
          <Link to={`/post/edit?_id=${record._id}`}>编辑</Link>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem([record._id])}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ProColumns<PostEntity>[];
