import React, { useEffect } from 'react';
import { Card, Input, Button, Select, DatePicker, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { If, Choose, When, Otherwise, For } from 'tsx-control-statements/components';
import SimpleMDE from 'react-simplemde-editor';
import { StringParam, useQueryParams } from 'use-query-params';
import PhotoPickerModal from '@/components/PhotoPicker';
import 'easymde/dist/easymde.min.css';
import useAppModel from '@/models/app';
import useCategoryModel from '@/pages/post/category/model';
import usePostModel from '../model';
import styles from './index.less';
import MultiTag from './components/MultiTag';
import AddCategoryModal from '../category/components/AddCategoryModal';
import PhotoPickerItem from './components/PhotoPickerItem';
import Block from '@/pages/post/edit/components/Block';
import { PostType, postTypeOptions } from '@/pages/post/types/PostType';
import { PostStatus } from '@/pages/post/types/PostStatus';
import { creatCategoryTitleByDepth } from '@/utils/help';
import type { PostEntity } from '@/pages/post/types/post.entity';
import type { TagEntity } from '@/pages/tag/types/tag.entity';

const FormItem = Form.Item;
const { TextArea } = Input;

const PostDetail = () => {
  const postModel = usePostModel();
  const appModel = useAppModel();
  const categoryModel = useCategoryModel();
  const [form] = Form.useForm();

  const [query] = useQueryParams({
    _id: StringParam,
  });

  const { _id } = query;

  useEffect(() => {
    if (_id) {
      postModel.indexDetail({ _id });
    }
    return () => {
      postModel.setDetail(undefined);
    };
  }, [_id]);

  useEffect(() => {
    form.setFieldsValue(postModel.detail);
  }, [postModel.detail]);

  useEffect(() => {
    categoryModel.index();
  }, []);

  const getTagsValue = (values) => {
    const result = [];
    values.forEach((item) => {
      result.push(item._id);
    });
    return result;
  };

  /**
   * 提交按钮事件
   * @param status
   * @param type
   */
  const handleSubmit = (status: PostStatus, type: 'create' | 'update') => {
    form.validateFields().then((values) => {
      const data = values;
      console.log('values', data);
      data.post_status = status;
      if (data.gallery_style) {
        data.gallery_style = getTagsValue(data.gallery_style);
      }
      if (data.movie_director) {
        data.movie_director = getTagsValue(data.movie_director);
      }
      if (data.movie_actor) {
        data.movie_actor = getTagsValue(data.movie_actor);
      }
      if (data.movie_style) {
        data.movie_style = getTagsValue(data.movie_style);
      }
      if (
        [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(data.post_type) &&
        !data.post_cover._id
      ) {
        message.error('请上传封面');
        return;
      }
      if (data.post_cover) {
        data.post_cover = data.post_cover._id;
      }
      switch (type) {
        case 'create':
          data.post_author = appModel.user!._id;
          console.log('create', data);
          postModel.create(data);
          break;
        case 'update':
          console.log('update', postModel.detail!._id, data);
          postModel.update(postModel.detail!._id, data);
          break;
        default:
      }
    });
  };

  const onAddTag = (
    name: 'movie_actor' | 'movie_director' | 'movie_style' | 'gallery_style',
    value: string,
  ) => {
    postModel.createTag(name, value);
  };

  const onUpdateTags = (
    name: 'movie_actor' | 'movie_director' | 'movie_style' | 'gallery_style',
    tags: TagEntity[],
  ) => {
    postModel.updateTag(name, tags);
  };

  /**
   * 打开图片选择器事件
   * @param type
   */
  const openPhotoPicker = (type: 'post_cover') => {
    postModel.setShowPhotoPicker(type);
  };

  /**
   * 关闭图片选择器
   */
  const handlePhotoPickerCancel = () => {
    postModel.setShowPhotoPicker(undefined);
  };

  /**
   * 图片选择器的确认事件
   */
  const handlePhotoPickerOk = () => {
    postModel.addPhoto();
    handlePhotoPickerCancel();
  };

  /**
   * 清空图片选择器的图片
   * @param type
   */
  const handlePhotoClear = (type: 'post_cover') => {
    postModel.setDetail({ ...postModel.detail, [type]: {} });
  };

  /**
   * 新增分类弹窗事件
   */
  const handleAddNewCategory = () => {
    categoryModel.setModalType(0);
    categoryModel.setShowModal(true);
  };

  const detail = postModel.detail || ({} as PostEntity);

  console.log('detail', detail);

  /**
   * 定义tag选择器的参数
   */
  const tagProps = {
    detail,
    onTagsChange: onUpdateTags,
    onAddTag,
    form,
    styles,
  };
  const galleryStyleProps = { ...tagProps, name: 'gallery_style', title: '照片风格' };
  const movieDirectorProps = { ...tagProps, name: 'movie_director', title: '导演' };
  const movieActorProps = { ...tagProps, name: 'movie_actor', title: '演员' };
  const movieStyleProps = { ...tagProps, name: 'movie_style', title: '电影风格' };

  /**
   * 定义图片选择的参数
   */
  const photoProps = {
    detail,
    form,
    handlePhotoClear,
    openPhotoPicker,
  };
  const postCoverProps = { ...photoProps, name: 'post_cover', title: '封面', size: '1920*1080' };

  return (
    <Card>
      <Form
        form={form}
        onValuesChange={(changedValues) => {
          postModel.setDetail({ ...detail, ...changedValues });
        }}
      >
        <div className={styles.main}>
          <div className={styles.mainArea}>
            <If
              condition={
                [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(
                  detail.post_type,
                ) || !detail.post_type
              }
            >
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
            <If condition={[PostType.QUOTE].includes(detail.post_type)}>
              <FormItem name="quote_content" rules={[{ required: true, message: '请输入内容' }]}>
                <TextArea rows={4} placeholder="请输入话语" maxLength={500} />
              </FormItem>
              <FormItem name="quote_author" rules={[{ required: true, message: '请输入作者名' }]}>
                <Input type="text" size="large" placeholder="请输入作者" max={50} />
              </FormItem>
            </If>
          </div>
          <div className={styles.sider}>
            <Block title="发布">
              <Choose>
                <When condition={!!detail._id}>
                  <If condition={detail.post_status === PostStatus.PUBLISHED}>
                    <Button
                      type="primary"
                      onClick={() => handleSubmit(PostStatus.PUBLISHED, 'update')}
                    >
                      更新
                    </Button>
                  </If>
                  <If condition={detail.post_status === PostStatus.DRAFT}>
                    <Button
                      type="primary"
                      className={styles.rightButton}
                      onClick={() => handleSubmit(PostStatus.PUBLISHED, 'update')}
                    >
                      发布
                    </Button>
                    <Button onClick={() => handleSubmit(PostStatus.DRAFT, 'update')}>保存</Button>
                  </If>
                </When>
                <Otherwise>
                  <Button
                    type="primary"
                    className={styles.rightButton}
                    onClick={() => handleSubmit(PostStatus.PUBLISHED, 'create')}
                  >
                    发布
                  </Button>
                  <Button onClick={() => handleSubmit(PostStatus.DRAFT, 'create')}>保存草稿</Button>
                </Otherwise>
              </Choose>
            </Block>
            <Block title="文章类型">
              <FormItem
                name="post_type"
                className={styles.lastMargin}
                initialValue={PostType.ARTICLE}
              >
                <Select options={postTypeOptions} />
              </FormItem>
            </Block>
            <Block title="分类目录">
              <FormItem name="post_category" rules={[{ required: true, message: '请选择分类' }]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择"
                  filterOption={(input, option) =>
                    option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <For
                    each="option"
                    of={categoryModel.list}
                    body={(option) => (
                      <Option value={option._id} key={option._id}>
                        {creatCategoryTitleByDepth(option.category_title, option)}
                      </Option>
                    )}
                  />
                </Select>
              </FormItem>
              <Button type="dashed" onClick={handleAddNewCategory}>
                <PlusOutlined />
                新建分类
              </Button>
            </Block>
            <If
              condition={[PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(
                detail.post_type,
              )}
            >
              <PhotoPickerItem {...postCoverProps} />
            </If>
            <If condition={detail.post_type === PostType.MOVIE}>
              <Block title="电影英文名">
                <FormItem name="movie_name_en" className={styles.lastMargin}>
                  <Input type="text" placeholder="请输入英文名" />
                </FormItem>
              </Block>
              <Block title="上映年代">
                <FormItem name="movie_time" className={styles.lastMargin}>
                  <DatePicker placeholder="请选择上映年代" />
                </FormItem>
              </Block>
              <MultiTag {...movieDirectorProps} />
              <MultiTag {...movieActorProps} />
              <MultiTag {...movieStyleProps} />
            </If>
            <If condition={detail.post_type === PostType.PHOTOGRAPH}>
              <Block title="拍摄地点">
                <FormItem name="gallery_location" className={styles.lastMargin}>
                  <Input type="text" placeholder="请填写地址" />
                </FormItem>
              </Block>
              <Block title="拍摄时间">
                <FormItem name="gallery_time" className={styles.lastMargin}>
                  <DatePicker placeholder="请选择拍摄时间" />
                </FormItem>
              </Block>
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
  );
};

export default PostDetail;
