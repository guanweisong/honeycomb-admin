import React from 'react';
import moment from 'moment';
import { Link } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import { Popconfirm } from 'antd';
import type { PostEntity } from '@/pages/post/types/post.entity';
import { PostType, postTypeOptions, PostTypeName } from '@/pages/post/types/PostType';
import { PostStatus, PostStatusName, postStatusOptions } from '@/pages/post/types/PostStatus';

export interface PostListTableColumnsProps {
  post_type: PostType[];
  post_status: PostStatus[];
  handleDeleteItem: (id: string) => void;
}

export const PostListTableColumns = (props: PostListTableColumnsProps) =>
  [
    {
      title: '文章名称',
      dataIndex: 'post_title',
      key: 'post_title',
    },
    {
      title: '引用内容',
      dataIndex: 'quote_content',
      key: 'quote_content',
    },
    {
      title: '分类',
      dataIndex: 'post_category',
      key: 'post_category',
      render: (text) => text.category_title,
    },
    {
      title: '类型',
      dataIndex: 'post_type',
      key: 'post_type',
      filters: postTypeOptions.map((item) => ({ text: item.label, value: item.value })),
      filteredValue: props.post_type,
      render: (text) => PostTypeName[PostType[text] as keyof typeof PostTypeName],
    },
    {
      title: '作者',
      dataIndex: 'post_author',
      key: 'post_author',
      render: (text) => text.user_name,
    },
    {
      title: '状态',
      dataIndex: 'post_status',
      key: 'post_status',
      filters: postStatusOptions.map((item) => ({ text: item.label, value: item.value })),
      filteredValue: props.post_status,
      render: (text) => PostStatusName[PostStatus[text] as keyof typeof PostStatusName],
    },
    {
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '点击量',
      dataIndex: 'post_views',
      key: 'post_views',
      sorter: true,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          <Link to={`/post/edit?_id=${record._id}`}>编辑</Link>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDeleteItem(record._id)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ] as ColumnsType<PostEntity>;
