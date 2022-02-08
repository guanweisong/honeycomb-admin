import React, { useEffect } from 'react';
import { Card, Input, Button, Form } from 'antd';
import { If, When, Otherwise, Choose } from 'tsx-control-statements/components';
import SimpleMDE from 'react-simplemde-editor';
import { StringParam, useQueryParams } from 'use-query-params';
import 'easymde/dist/easymde.min.css';
import useAppModel from '@/models/app';
import styles from './index.less';
import usePageModel from '../model';
import { PageStatus } from '@/pages/page/types/PageStatus';

const FormItem = Form.Item;

const Page = () => {
  const pageModel = usePageModel();
  const appModel = useAppModel();
  const [form] = Form.useForm();

  const [query] = useQueryParams({
    _id: StringParam,
  });

  const { _id } = query;

  useEffect(() => {
    if (_id) {
      pageModel.detail({ _id });
    } else {
      pageModel.setCurrentItem(undefined);
    }
  }, [_id]);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(pageModel.currentItem);
  }, [pageModel.currentItem]);

  const handleUpdate = (status: PageStatus) => {
    form
      .validateFields()
      .then((values) => {
        const data = values;
        data.page_status = status;
        pageModel.update(pageModel.currentItem?._id as string, data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSubmit = (status: PageStatus) => {
    form
      .validateFields()
      .then((values) => {
        const data = values;
        data.page_status = status;
        data.page_author = appModel.user?._id;
        pageModel.create(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const { currentItem } = pageModel;

  return (
    <Card>
      <Form form={form}>
        <div className={styles.main}>
          <div className={styles.mainArea}>
            <FormItem name="page_title">
              <Input type="text" size="large" placeholder="在此输入文章标题" />
            </FormItem>
            <FormItem name="page_content">
              <SimpleMDE className="markdown-body" />
            </FormItem>
          </div>
          <div className={styles.sider}>
            <dl className={styles.block}>
              <dt className={styles.blockTitle}>发布</dt>
              <dd className={styles.blockContent}>
                <Choose>
                  <When condition={currentItem?._id}>
                    <If condition={currentItem!.page_status === PageStatus.PUBLISHED}>
                      <Button type="primary" onClick={() => handleUpdate(0)}>
                        更新
                      </Button>
                    </If>
                    <If condition={currentItem!.page_status === PageStatus.DRAFT}>
                      <Button
                        type="primary"
                        className={styles.rightButton}
                        onClick={() => handleUpdate(PageStatus.PUBLISHED)}
                      >
                        发布
                      </Button>
                      <Button onClick={() => handleUpdate(PageStatus.DRAFT)}>保存</Button>
                    </If>
                  </When>
                  <Otherwise>
                    <Button
                      type="primary"
                      className={styles.rightButton}
                      onClick={() => handleSubmit.bind(PageStatus.PUBLISHED)}
                    >
                      发布
                    </Button>
                    <Button onClick={() => handleSubmit(PageStatus.DRAFT)}>保存草稿</Button>
                  </Otherwise>
                </Choose>
              </dd>
            </dl>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default Page;
