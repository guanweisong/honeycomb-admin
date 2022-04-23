import moment from 'moment';
import { Popconfirm } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';
import { commentStatusOptions } from '@/pages/comment/types/CommentStatus';
export interface CommentTableColumnsProps {
  handleDelete: (ids: string[]) => void;
  renderOpt: (record: CommentEntity) => void;
}

export const commentTableColumns = (props: CommentTableColumnsProps) =>
  [
    {
      title: '评论内容',
      dataIndex: 'comment_content',
      key: 'comment_content',
    },
    {
      title: '评论文章',
      dataIndex: 'comment_post',
      key: 'comment_post',
      render: (text: any) => {
        return text?.post_title;
      },
    },
    {
      title: '评论人',
      dataIndex: 'comment_author',
      key: 'comment_author',
    },
    {
      title: '评论人邮箱',
      dataIndex: 'comment_email',
      key: 'comment_email',
    },
    {
      title: '评论IP',
      dataIndex: 'comment_ip',
      key: 'comment_ip',
    },
    {
      title: '评论状态',
      dataIndex: 'comment_status',
      key: 'comment_status',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: commentStatusOptions,
      },
    },
    {
      title: '添加时间',
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
      title: '操作',
      key: 'operation',
      width: 100,
      search: false,
      render: (text, record) => (
        <div>
          {props.renderOpt(record)}&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => props.handleDelete([record._id])}>
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ] as ProColumns<CommentEntity>[];
