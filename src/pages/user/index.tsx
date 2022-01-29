import React, { useEffect } from 'react';
import { Table, Card, Row, Col, Input, Radio, Button, Modal, Form } from 'antd';
import md5 from 'md5';
import {
  StringParam,
  NumberParam,
  useQueryParams,
  withDefault,
  NumericArrayParam,
} from 'use-query-params';
import type { RuleObject } from 'antd/es/form';
import useUserModel from './model';
import type { UserEntity } from '@/pages/user/types/user.entity';
import { userTableColumns } from '@/pages/user/constants/userTableColumns';
import { UserStatus, userStatusOptions } from '@/pages/user/types/UserStatus';
import { UserLevel, userLevelOptions } from '@/pages/user/types/UserLevel';
import type { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { ModalType, ModalTypeName } from '@/types/ModalType';
import { formItemLayout } from '@/constants/formItemLayout';

const User = () => {
  const userModel = useUserModel();
  const [form] = Form.useForm();

  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    limit: withDefault(NumberParam, 10),
    keyword: StringParam,
    user_level: NumericArrayParam,
    user_status: NumericArrayParam,
    sortField: StringParam,
    sortOrder: StringParam,
  });

  const { keyword, limit, page, user_level, user_status } = query;

  /**
   * 删除事件
   * @param ids
   */
  const handleDeleteItem = (ids: string[]) => {
    userModel.destroy(ids);
  };

  /**
   * 编辑事件
   * @param record
   */
  const handleEditItem = (record: UserEntity) => {
    form.setFieldsValue(record);
    userModel.setCurrentItem(record);
    userModel.setModalType(ModalType.EDIT);
    userModel.setShowModal(true);
  };

  /**
   * 初始化查询
   */
  useEffect(() => {
    userModel.index(query);
  }, [query]);

  /**
   * 表格change事件
   * @param pagination
   * @param filters
   * @param sorter
   */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    const { field, order } = sorter as SorterResult<any>;
    console.log(pagination, filters, sorter);
    setQuery({
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
      sortField: field as string,
      sortOrder: order,
    });
  };

  /**
   * 搜索事件
   * @param value
   */
  const handleSearchChange = (value: string) => {
    setQuery({ ...query, keyword: value });
  };

  /**
   * 新增、修改保存事件
   */
  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { user_password, ...rest } = values;
        const params = rest;
        if (user_password) {
          params.user_password = md5(values.user_password);
        }
        if (userModel.modalType === 0) {
          userModel.create(params);
        } else {
          userModel.update(userModel.currentItem?._id as string, params);
        }
        userModel.setShowModal(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /**
   * 新增、修改弹窗关闭事件
   */
  const handleModalCancel = () => {
    userModel.setShowModal(false);
  };

  /**
   * 新增事件
   */
  const handleAddNew = () => {
    form.resetFields();
    form.setFieldsValue({ user_level: UserLevel.EDITOR, user_status: UserStatus.ENABLE });
    userModel.setCurrentItem(undefined);
    userModel.setModalType(ModalType.ADD);
    userModel.setShowModal(true);
  };

  /**
   * 校验用户名是否唯一
   * @param rule
   * @param value
   */
  const validateUserName = async (rule: RuleObject, value: string) => {
    if (value && value.length > 0) {
      const result = await userModel.checkExist({ user_name: value });
      if (result) {
        return Promise.reject('抱歉，用户名已存在，请换一个用户名');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  /**
   * 校验邮箱地址是否唯一
   * @param rule
   * @param value
   */
  const validateUserEmail = async (rule: RuleObject, value: string) => {
    if (value && value.length > 0) {
      const result = await userModel.checkExist({ user_email: value });
      if (result) {
        return Promise.reject('抱歉，用户邮箱已存在，请换一个用户邮箱');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
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
            user_level: user_level as UserLevel[],
            user_status: user_status as UserStatus[],
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
        title={`${ModalTypeName[ModalType[userModel.modalType] as keyof typeof ModalTypeName]}用户`}
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
            rules={[{ required: userModel.modalType === ModalType.ADD, message: '请输入密码' }]}
          >
            <Input
              autoComplete="off"
              type="password"
              maxLength={20}
              minLength={6}
              placeholder={userModel.modalType === ModalType.EDIT ? '留空则为不修改' : ''}
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
              options={userLevelOptions}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="user_status" label="状态">
            <Radio.Group
              buttonStyle="solid"
              disabled={userModel.currentItem?.user_level === UserLevel.ADMIN}
              options={userStatusOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default User;
