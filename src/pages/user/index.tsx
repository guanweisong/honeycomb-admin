import React, { useEffect } from 'react';
import { Table, Card, Row, Col, Input, Radio, Button, Modal, Form } from 'antd';
import { For } from 'tsx-control-statements/components';
import md5 from 'md5';
import { StringParam, NumberParam, useQueryParams, withDefault } from 'use-query-params';
import useUserModel from './model';
import type { UserEntity } from '@/pages/user/types/user.entity';
import { userTableColumns } from '@/pages/user/constants/userTableColumns';
import { UserState, userStateOptions } from '@/pages/user/types/UserState';
import { UserLevel, userLevelOptions } from '@/pages/user/types/UserLevel';

const User = () => {
  const userModel = useUserModel();
  const [form] = Form.useForm();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
    user_level: NumberParam,
    user_state: NumberParam,
  });

  const { keyword, limit, page, user_level, user_state } = query;

  const handleDeleteItem = (ids: string[]) => {
    userModel.destroy(ids);
  };

  const handleEditItem = (record: UserEntity) => {
    form.setFieldsValue(record);
    userModel.setCurrentItem(record);
    userModel.setModalType(1);
    userModel.setShowModal(true);
  };

  useEffect(() => {
    userModel.index(query);
  }, [query]);

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    setQuery({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const handleSearchChange = (value: string) => {
    setQuery({ ...query, keyword: value });
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        // eslint-disable-next-line no-unused-expressions,no-param-reassign
        values.user_password && (values = { ...values, user_password: md5(values.user_password) });
        if (userModel.modalType === 0) {
          userModel.create(values);
        } else {
          userModel.update(userModel.currentItem._id, values);
        }
        userModel.setShowModal(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleModalCancel = () => {
    userModel.setShowModal(false);
  };

  const handleAddNew = () => {
    form.resetFields();
    form.setFieldsValue({ user_level: 2, user_status: 1 });
    userModel.setCurrentItem(undefined);
    userModel.setModalType(0);
    userModel.setShowModal(true);
  };

  const validateUserName = async (rule, value) => {
    if (value && value.length > 0) {
      const result = await userModel.checkExist({ user_name: value });
      if (result) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('抱歉，用户名已存在，请换一个用户名');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  const validateUserEmail = async (rule, value) => {
    if (value && value.length > 0) {
      const result = await userModel.checkExist({ user_email: value });
      if (result) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('抱歉，用户邮箱已存在，请换一个用户邮箱');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
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
                  defaultValue={keyword || ''}
                  onSearch={handleSearchChange}
                  placeholder="按用户名或者邮箱"
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleAddNew}>
                添加新用户
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={userTableColumns({
            user_level: user_level as UserLevel,
            user_state: user_state as UserState,
            handleDeleteItem,
            handleEditItem,
          })}
          rowKey={(record) => record._id}
          dataSource={userModel.list}
          rowClassName={(record) => (record.user_status === -1 ? 'gray' : '')}
          pagination={{
            showSizeChanger: true,
            total: userModel.total,
            pageSize: limit,
            current: page,
          }}
          onChange={handleTableChange}
          loading={userModel.loading}
        />
      </Card>
      <Modal
        title={userModel.modalType ? '修改用户' : '添加新用户'}
        visible={userModel.showModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} onFinish={handleModalOk}>
          <Form.Item
            {...formItemLayout}
            name="user_name"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }, { validator: validateUserName }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="user_password"
            label="密码"
            rules={[{ required: !userModel.modalType, message: '请输入密码' }]}
          >
            <Input
              autoComplete="off"
              type="password"
              maxLength={20}
              minLength={6}
              placeholder={userModel.modalType === 1 ? '留空则为不修改' : ''}
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="邮箱"
            name="user_email"
            rules={[
              { required: true, message: '请输入用户邮箱' },
              { type: 'email', message: '请输入正确的邮箱' },
              { validator: validateUserEmail },
            ]}
          >
            <Input.TextArea rows={3} autoComplete="off" maxLength={20} />
          </Form.Item>
          <Form.Item {...formItemLayout} name="user_level" label="级别">
            <Radio.Group
              buttonStyle="solid"
              disabled={userModel.currentItem?.user_level === UserLevel.ADMIN}
            >
              <For
                of={userLevelOptions}
                body={(item, index) => (
                  <Radio.Button value={item.value} key={index}>
                    {item.label}
                  </Radio.Button>
                )}
              />
            </Radio.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} name="user_status" label="状态">
            <Radio.Group
              buttonStyle="solid"
              disabled={userModel.currentItem?.user_level === UserLevel.ADMIN}
            >
              <For
                of={userStateOptions}
                body={(item, index) => (
                  <Radio.Button value={item.value} key={index}>
                    {item.label}
                  </Radio.Button>
                )}
              />
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default User;
