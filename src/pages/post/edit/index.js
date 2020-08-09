import React, { useEffect } from 'react'
import { Card, Input, Button, Select, DatePicker, message, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import SimpleMDE from 'react-simplemde-editor'
import PhotoPickerModal from '@/components/PhotoPicker'
import { postTypeMap } from '@/utils/mapping'
import { creatCategoryTitleByDepth } from '@/utils/help'
import 'easymde/dist/easymde.min.css'
import useAppModel from '@/models/app'
import useCategoryModel from '@/models/category'

import { useLocation } from 'umi'
import usePostModel from '../model'
import styles from './index.less'
import MultiTag from './components/MultiTag'
import AddCategoryModal from '../category/components/AddCategoryModal'
import PhotoPickerItem from './components/PhotoPickerItem'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

const PostDetail = () => {
  const postModel = usePostModel()
  const appModel = useAppModel()
  const categoryModel = useCategoryModel()
  const location = useLocation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (location.query._id) {
      postModel.indexDetail({ _id: location.query._id })
    } else {
      postModel.resetDetail()
    }
    return () => {
      postModel.resetDetail()
    }
  }, [])

  useEffect(() => {
    form.setFieldsValue(postModel.detail)
  }, [postModel.detail])

  useEffect(() => {
    categoryModel.index()
  }, [])

  const getTagsValue = (values) => {
    const result = []
    values.forEach((item) => {
      result.push(item._id)
    })
    return result
  }

  const handleSubmit = (status, type) => {
    form.validateFields().then((values) => {
      const data = values
      console.log('values', data)
      data.post_status = status
      if (data.gallery_style) {
        data.gallery_style = getTagsValue(data.gallery_style)
      }
      if (data.movie_director) {
        data.movie_director = getTagsValue(data.movie_director)
      }
      if (data.movie_actor) {
        data.movie_actor = getTagsValue(data.movie_actor)
      }
      if (data.movie_style) {
        data.movie_style = getTagsValue(data.movie_style)
      }
      if ([0, 1, 2].includes(data.post_type) && !data.post_cover._id) {
        message.error('请上传封面')
        return
      }
      if (data.post_cover) {
        data.post_cover = data.post_cover._id
      }
      switch (type) {
        case 'create':
          data.post_author = appModel.user._id
          console.log('create', data)
          postModel.create(data)
          break
        case 'update':
          console.log('update', postModel.detail._id, data)
          postModel.update(postModel.detail._id, data)
          break
        default:
      }
    })
  }

  const onAddTag = (name, value) => {
    postModel.createTag(name, value)
  }

  const onUpdateTags = (name, values) => {
    postModel.updateTag(name, values)
  }

  const openPhotoPicker = (type = '') => {
    postModel.setShowPhotoPicker(type)
  }

  const handlePhotoPickerCancel = () => {
    postModel.setShowPhotoPicker('')
  }

  const handlePhotoPickerOk = () => {
    postModel.addPhoto()
    handlePhotoPickerCancel()
  }

  const handlePhotoClear = (type) => {
    postModel.setDetail({ ...postModel.detail, [type]: {} })
  }

  const handleAddNewCategory = () => {
    categoryModel.setModalType(0)
    categoryModel.setShowModal(true)
  }

  const { detail } = postModel

  console.log('detail', detail)
  const tagProps = {
    detail,
    onTagsChange: onUpdateTags,
    onAddTag,
    form,
    styles,
  }
  const galleryStyleProps = { ...tagProps, name: 'gallery_style', title: '照片风格' }
  const movieDirectorProps = { ...tagProps, name: 'movie_director', title: '导演' }
  const movieActorProps = { ...tagProps, name: 'movie_actor', title: '演员' }
  const movieStyleProps = { ...tagProps, name: 'movie_style', title: '电影风格' }
  const photoProps = {
    styles,
    detail,
    form,
    handlePhotoClear,
    openPhotoPicker,
  }
  const postCoverProps = { ...photoProps, name: 'post_cover', title: '封面', size: '1920*1080' }

  return (
    <Card>
      <Form
        form={form}
        onValuesChange={(changedValues) => {
          postModel.setDetail({ ...detail, ...changedValues })
        }}
      >
        <div className={styles.main}>
          <div className={styles.mainArea}>
            <If condition={[0, 1, 2].includes(detail.post_type)}>
              <FormItem name="post_title" rules={[{ required: true, message: '请输入标题' }]}>
                <Input type="text" size="large" placeholder="在此输入文章标题" maxLength={20} />
              </FormItem>
              <FormItem
                name="post_content"
                rules={[
                  { max: 20000, message: '最多只能输入20000个字符' },
                  { required: true, message: '请输入内容' },
                ]}
              >
                <SimpleMDE className="markdown-body" />
              </FormItem>
              <FormItem name="post_excerpt">
                <TextArea rows={4} placeholder="内容简介" maxLength={200} />
              </FormItem>
            </If>
            <If condition={[3].includes(detail.post_type)}>
              <FormItem name="quote_content" rulee={[{ required: true, message: '请输入内容' }]}>
                <TextArea rows={4} placeholder="请输入话语" maxLength={500} />
              </FormItem>
              <FormItem name="quote_author" rules={[{ required: true, message: '请输入作者名' }]}>
                <Input type="text" size="large" placeholder="请输入作者" max={50} />
              </FormItem>
            </If>
          </div>
          <div className={styles.sider}>
            <dl className={styles.block}>
              <dt className={styles.blockTitle}>发布</dt>
              <dd className={styles.blockContent}>
                <Choose>
                  <When condition={!!detail._id}>
                    <If condition={detail.post_status === 0}>
                      <Button type="primary" onClick={() => handleSubmit(0, 'update')}>
                        更新
                      </Button>
                    </If>
                    <If condition={detail.post_status === 1}>
                      <Button
                        type="primary"
                        className={styles.rightButton}
                        onClick={() => handleSubmit(0, 'update')}
                      >
                        发布
                      </Button>
                      <Button onClick={() => handleUpdate(1, 'update')}>保存</Button>
                    </If>
                  </When>
                  <Otherwise>
                    <Button
                      type="primary"
                      className={styles.rightButton}
                      onClick={() => handleSubmit(0, 'create')}
                    >
                      发布
                    </Button>
                    <Button onClick={() => handleSubmit(1, 'create')}>保存草稿</Button>
                  </Otherwise>
                </Choose>
              </dd>
            </dl>
            <dl className={styles.block}>
              <dt className={styles.blockTitle}>文章类型</dt>
              <dd className={styles.blockContent}>
                <FormItem name="post_type" className={styles.lastMargin}>
                  <Select>
                    <For each="item" of={postTypeMap}>
                      <Option value={item.value} key={item.value}>
                        {item.text}
                      </Option>
                    </For>
                  </Select>
                </FormItem>
              </dd>
            </dl>
            <dl className={styles.block}>
              <dt className={styles.blockTitle}>分类目录</dt>
              <dd className={styles.blockContent}>
                <FormItem name="post_category" rules={[{ required: true, message: '请选择分类' }]}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="">未分类</Option>
                    <For each="item" of={categoryModel.list}>
                      <Option value={item._id} key={item._id}>
                        {creatCategoryTitleByDepth(item.category_title, item)}
                      </Option>
                    </For>
                  </Select>
                </FormItem>
                <Button type="dashed" onClick={handleAddNewCategory}>
                  <PlusOutlined />
                  新建分类
                </Button>
              </dd>
            </dl>
            <If condition={[0, 1, 2].includes(detail.post_type)}>
              <PhotoPickerItem {...postCoverProps} />
            </If>
            <If condition={detail.post_type === 1}>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>电影英文名</dt>
                <dd className={styles.blockContent}>
                  <FormItem name="movie_name_en" className={styles.lastMargin}>
                    <Input type="text" placeholder="请输入英文名" />
                  </FormItem>
                </dd>
              </dl>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>上映年代</dt>
                <dd className={styles.blockContent}>
                  <FormItem name="movie_time" className={styles.lastMargin}>
                    <DatePicker placeholder="请选择上映年代" />
                  </FormItem>
                </dd>
              </dl>
              <MultiTag {...movieDirectorProps} />
              <MultiTag {...movieActorProps} />
              <MultiTag {...movieStyleProps} />
            </If>
            <If condition={detail.post_type === 2}>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>拍摄地点</dt>
                <dd className={styles.blockContent}>
                  <FormItem name="gallery_location" className={styles.lastMargin}>
                    <Input type="text" placeholder="请填写地址" />
                  </FormItem>
                </dd>
              </dl>
              <dl className={styles.block}>
                <dt className={styles.blockTitle}>拍摄时间</dt>
                <dd className={styles.blockContent}>
                  <FormItem name="gallery_time" className={styles.lastMargin}>
                    <DatePicker placeholder="请选择拍摄时间" />
                  </FormItem>
                </dd>
              </dl>
              <MultiTag {...galleryStyleProps} />
            </If>
          </div>
        </div>
      </Form>
      <PhotoPickerModal
        showPhotoPicker={!!postModel.showPhotoPicker}
        handlePhotoPickerOk={handlePhotoPickerOk}
        handlePhotoPickerCancel={handlePhotoPickerCancel}
      />
      <AddCategoryModal />
    </Card>
  )
}

export default PostDetail
