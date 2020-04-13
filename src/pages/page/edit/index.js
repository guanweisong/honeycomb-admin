import React, { useEffect } from 'react'
import { Card, Input, Button, Form } from 'antd'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import { useLocation } from 'umi'
import useAppModel from '@/models/app'
import styles from './index.less'
import usePageModel from '../model'

const FormItem = Form.Item

const Page = () => {
  const pageModel = usePageModel()
  const appModel = useAppModel()
  const [form] = Form.useForm()
  const location = useLocation()

  useEffect(() => {
    if (location.query._id) {
      pageModel.detail({ _id: location.query._id })
    } else {
      pageModel.setCurrentItem({})
    }
  }, [location])

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(pageModel.currentItem)
  }, [pageModel.currentItem])

  const handleUpdate = (status) => {
    form
      .validateFields()
      .then((values) => {
        const data = values
        data.page_status = status
        pageModel.update(pageModel.currentItem._id, data)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const handleSubmit = (status) => {
    form
      .validateFields()
      .then((values) => {
        const data = values
        data.page_status = status
        data.page_author = appModel.user._id
        pageModel.create(data)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const { currentItem } = pageModel

  return (
    <Card>
      <Form form={form}>
        <div className={styles.main}>
          <div className={styles.mainArea}>
            <FormItem name="page_title">
              <Input type="text" size="large" placeholder="在此输入文章标题" />
            </FormItem>
            <FormItem name="page_content">
              <SimpleMDE />
            </FormItem>
          </div>
          <div className={styles.sider}>
            <dl className={styles.block}>
              <dt className={styles.blockTitle}>发布</dt>
              <dd className={styles.blockContent}>
                <Choose>
                  <When condition={!!currentItem._id}>
                    <If condition={currentItem.page_status === 0}>
                      <Button type="primary" onClick={() => handleUpdate.bind(0)}>
                        更新
                      </Button>
                    </If>
                    <If condition={currentItem.page_status === 1}>
                      <Button
                        type="primary"
                        className={styles.rightButton}
                        onClick={() => handleUpdate.bind(0)}
                      >
                        发布
                      </Button>
                      <Button onClick={() => handleUpdate.bind(1)}>保存</Button>
                    </If>
                  </When>
                  <Otherwise>
                    <Button
                      type="primary"
                      className={styles.rightButton}
                      onClick={() => handleSubmit.bind(0)}
                    >
                      发布
                    </Button>
                    <Button onClick={() => handleSubmit(1)}>保存草稿</Button>
                  </Otherwise>
                </Choose>
              </dd>
            </dl>
          </div>
        </div>
      </Form>
    </Card>
  )
}

export default Page
