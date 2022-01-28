import React, { useEffect } from 'react';
import { Table, Popconfirm, Card, Input, Row, Col, Button, Form } from 'antd';
import { StringParam, NumberParam, useQueryParams, withDefault } from 'use-query-params';
import moment from 'moment';
import { Link } from 'umi';
import { postStatusMap } from '@/utils/mapping';
import usePageModel from '../model';

const Page = () => {
  const pageModel = usePageModel();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    page_status: NumberParam,
    keyword: StringParam,
  });

  const { page, limit, page_status, keyword } = query;

  const handleDeleteItem = (id) => {
    pageModel.distory(id);
  };

  const columns = [
    {
      title: '文章名称',
      dataIndex: 'page_title',
      key: 'page_title',
    },
    {
      title: '作者',
      dataIndex: 'page_author',
      key: 'page_author',
      render: (text) => text.user_name,
    },
    {
      title: '状态',
      dataIndex: 'page_status',
      key: 'page_status',
      filters: postStatusMap,
      filteredValue: page_status,
      render: (text) => postStatusMap.find((item) => item.value === text).text,
    },
    {
      title: '发表时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后更新日期',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '点击量',
      dataIndex: 'page_views',
      key: 'page_views',
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          <Link to={`/page/edit?_id=${record._id}`}>编辑</Link>&nbsp;
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDeleteItem(record._id)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      ),
    },
  ];

  useEffect(() => {
    pageModel.index(query);
  }, [query]);

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    setQuery({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
    });
  };

  const handelSearchChange = (value: string) => {
    setQuery({
      ...query,
      page: 1,
      keyword: value,
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  return (
    <>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item {...formItemLayout}>
                <Input.Search
                  defaultValue={keyword as string}
                  onSearch={handelSearchChange}
                  placeholder="按文章名"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary">
                <Link to="/page/edit">添加新页面</Link>
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={pageModel.list}
          pagination={{
            showSizeChanger: true,
            total: pageModel.total,
            pageSize: limit,
            current: page,
          }}
          onChange={handleTableChange}
          loading={pageModel.loading}
        />
      </Card>
    </>
  );
};

export default Page;
