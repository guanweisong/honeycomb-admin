import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Card, Button, Form } from 'antd';
import moment from 'moment';
import AddCategoryModal from './components/AddCategoryModal';
import { enableStatusMap } from '@/utils/mapping';
import { creatCategoryTitleByDepth } from '@/utils/help';

const mapStateToProps = (state) => state;

@connect(mapStateToProps)
class Category extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'category_title',
        key: 'category_title',
        render: (text, record) => (
          creatCategoryTitleByDepth(text, record)
        ),
      },
      {
        title: '分类英文名',
        dataIndex: 'category_title_en',
        key: 'category_title_en',
      },
      {
        title: '分类描述',
        dataIndex: 'category_description',
        key: 'category_description',
      },
      {
        title: '状态',
        dataIndex: 'category_status',
        key: 'category_status',
        render: (text, record) => (
          enableStatusMap.find(item => item.value === text).text
        ),
      },
      {
        title: '添加时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => (
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        ),
      },
      {
        title: '最后更新日期',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => (
          moment(text).format('YYYY-MM-DD HH:mm:ss')
        ),
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => (
          <p>
            <a onClick={() => this.handleEditItem(record)}>编辑</a>&nbsp;
            <Popconfirm title="确定要删除吗？" onConfirm={() => this.handleDeleteItem(record._id)}>
              <a>删除</a>
            </Popconfirm>
          </p>
        ),
      }
    ];
  }
  handleAddNew = () => {
    this.props.dispatch({
      type: 'categories/saveCurrentItem',
      payload: {},
    });
    this.props.dispatch({
      type: 'categories/switchModalType',
      payload: 0,
    });
    this.props.dispatch({
      type: 'categories/setModalShow'
    });
  };
  handleDeleteItem = (id) => {
    this.props.dispatch({
      type: 'categories/distory',
      payload: id,
    });
  };
  handleEditItem = (record) => {
    this.props.dispatch({
      type: 'categories/saveCurrentItem',
      payload: record,
    });
    this.props.dispatch({
      type: 'categories/switchModalType',
      payload: 1,
    });
    this.props.dispatch({
      type: 'categories/setModalShow'
    });
  };
  render() {
    return (
      <div>
        <Card>
          <Form layout="inline" style={{marginBottom: "20px", textAlign: "right"}}>
            <Button type="primary" onClick={this.handleAddNew}>添加新分类</Button>
          </Form>
          <Table
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.props.categories.list}
            onChange={this.handleTableChange}
          />
        </Card>
        <AddCategoryModal />
      </div>
    )
  }
}

export default Category;
