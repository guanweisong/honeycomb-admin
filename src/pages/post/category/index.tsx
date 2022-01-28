import React, { useEffect } from 'react';
import { Table, Card, Button, Form, Col, Row } from 'antd';
import useCategoryModel from '@/pages/post/category/model';
import AddCategoryModal from './components/AddCategoryModal';
import type { CategoryEntity } from '@/pages/post/category/types/category.entity';
import { categoryListTableColumns } from '@/pages/post/category/constans/categoryListTableColumns';

const Category = () => {
  const categoryModel = useCategoryModel();
  const [form] = Form.useForm();

  const handleEditItem = (record: CategoryEntity) => {
    categoryModel.setCurrentItem(record);
    categoryModel.setModalType(1);
    categoryModel.setShowModal(true);
  };

  const handleDeleteItem = (ids: string[]) => {
    categoryModel.destroy(ids);
  };

  useEffect(() => {
    categoryModel.index();
  }, []);

  const handleAddNew = () => {
    categoryModel.setShowModal(true);
    categoryModel.setModalType(0);
    categoryModel.setCurrentItem(undefined);
  };

  return (
    <>
      <Card>
        <Form layout="inline" style={{ marginBottom: '20px', textAlign: 'right' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12} />
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新分类
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={categoryListTableColumns({ handleEditItem, handleDeleteItem })}
          rowKey={(record) => record._id}
          dataSource={categoryModel.list}
          size="middle"
          pagination={false}
        />
      </Card>
      <AddCategoryModal form={form} />
    </>
  );
};

export default Category;
