import { useEffect, useState } from 'react';
import { Card, Input, Button, Select, DatePicker, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { If, Choose, When, Otherwise, For } from 'tsx-control-statements/components';
import SimpleMDE from 'react-simplemde-editor';
import { PageContainer } from '@ant-design/pro-layout';
import { StringParam, useQueryParams } from 'use-query-params';
import PhotoPickerModal from '@/components/PhotoPicker';
import 'easymde/dist/easymde.min.css';
import styles from './index.less';
import MultiTag, { MultiTagProps } from './components/MultiTag';
import AddCategoryModal from '../category/components/AddCategoryModal';
import PhotoPickerItem, { PhotoPickerItemProps } from './components/PhotoPickerItem';
import Block from '@/pages/post/edit/components/Block';
import { PostType, postTypeOptions } from '@/pages/post/types/PostType';
import { PostStatus } from '@/pages/post/types/PostStatus';
import { creatCategoryTitleByDepth } from '@/utils/help';
import type { PostEntity } from '@/pages/post/types/post.entity';
import type { TagEntity } from '@/pages/tag/types/tag.entity';
import { ModalType } from '@/types/ModalType';
import { history } from 'umi';
import { useModel } from '@@/plugin-model/useModel';
import * as postsService from '@/pages/post/service';
import { CategoryReadOnly } from '@/pages/post/types/post.entity';
import { CategoryEntity } from '@/pages/post/category/types/category.entity';
import * as tagsService from '@/pages/tag/service';
import * as categoryService from '@/pages/post/category/service';
const showdown = require('showdown');

const converter = new showdown.Converter();

const FormItem = Form.Item;
const { TextArea } = Input;

const PostDetail = () => {
  const { initialState } = useModel('@@initialState');
  // @ts-ignore
  const [detail, setDetail] = useState<PostEntity>({ post_type: PostType.ARTICLE });
  const [list, setList] = useState<CategoryEntity[]>([]);
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<{
    type?: ModalType;
    visible: boolean;
    record?: CategoryEntity;
  }>({
    type: ModalType.ADD,
    visible: false,
  });

  const userInfo = initialState?.userInfo;

  const [form] = Form.useForm();

  const [query] = useQueryParams({
    _id: StringParam,
  });

  const { _id } = query;

  /**
   * 分类列表获取
   */
  const index = async () => {
    const result = await categoryService.index({ limit: 9999 });
    if (result.status === 200) {
      setList(result.data.list);
    }
  };

  /**
   * 查询文章详情
   * @param values
   */
  const indexDetail = async (values: Partial<PostEntity>) => {
    console.log('post=>model=>detail', values);
    let result;
    if (typeof values._id !== 'undefined') {
      result = await postsService.indexPostDetail(values);
      result = result.data;
      if (result.movie_time) {
        // @ts-ignore
        result.movie_time = moment(result.movie_time);
      }
      if (result.gallery_time) {
        // @ts-ignore
        result.gallery_time = moment(result.movie_time);
      }
      if (result.post_content) {
        result.post_content = converter.makeMd(result.post_content);
      }
      const post_category = result.post_category as CategoryReadOnly;
      if (post_category) {
        result.post_category = post_category._id as string;
      }
      setDetail(result);
    }
  };

  useEffect(() => {
    if (_id) {
      indexDetail({ _id });
    }
    return () => {
      setDetail(undefined);
    };
  }, [_id]);

  useEffect(() => {
    index();
  }, []);

  useEffect(() => {
    form.setFieldsValue(detail);
  }, [detail]);

  /**
   * 从tag对象数组中收集id数组
   * @param values
   */
  const getTagsValue = (values: Omit<TagEntity, 'created_at' | 'updated_at'>[]) => {
    const result: string[] = [];
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
    form.validateFields().then(async (values) => {
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
          data.post_author = userInfo!._id;
          console.log('create', data);
          const createResult = await postsService.create(data);
          if (createResult.status === 201) {
            message.success('添加成功');
            history.push({
              pathname: '/post/edit',
              query: {
                _id: createResult.data._id,
              },
            });
          }
          break;
        case 'update':
          console.log('update', detail!._id, data);
          const updateResult = await postsService.update(detail!._id, data);
          if (updateResult.status === 201) {
            message.success('更新成功');
            indexDetail({ _id: detail!._id });
          }
          break;
        default:
      }
    });
  };

  /**
   * 创建tag
   * @param name
   * @param tag_name
   */
  const onAddTag = async (
    name: 'movie_actor' | 'movie_director' | 'movie_style' | 'gallery_style',
    tag_name: string,
  ) => {
    const result = await tagsService.create({ tag_name });
    if (result && result.status === 201) {
      setDetail({
        ...detail,
        // @ts-ignore
        [name]: [...detail[name], { _id: result.data._id, tag_name: result.data.tag_name }],
      } as PostEntity);
    }
  };

  /**
   * 更新tag
   * @param name
   * @param tags
   */
  const onUpdateTags = (
    name: 'movie_actor' | 'movie_director' | 'movie_style' | 'gallery_style',
    tags: TagEntity[],
  ) => {
    setDetail({
      ...detail,
      [name]: tags,
    } as PostEntity);
  };

  /**
   * 打开图片选择器事件
   * @param type
   */
  const openPhotoPicker = () => {
    setShowPhotoPicker(true);
  };

  /**
   * 关闭图片选择器
   */
  const handlePhotoPickerCancel = () => {
    setShowPhotoPicker(false);
  };

  /**
   * 图片选择器的确认事件
   */
  const handlePhotoPickerOk = () => {
    // setDetail({ ...detail, post_cover: mediaModel.currentItem } as PostEntity);
    handlePhotoPickerCancel();
  };

  /**
   * 清空图片选择器的图片
   * @param type
   */
  const handlePhotoClear = () => {
    const { post_cover, ...rest } = detail as PostEntity;
    setDetail(rest);
  };

  /**
   * 新增分类弹窗事件
   */
  const handleAddNewCategory = () => {
    setModalProps({
      visible: true,
      type: ModalType.ADD,
    });
  };

  console.log('detail', detail);

  /**
   * 定义tag选择器的参数
   */
  const tagProps = {
    detail,
    onTagsChange: onUpdateTags,
    onAddTag,
  } as MultiTagProps;
  const galleryStyleProps: MultiTagProps = {
    ...tagProps,
    name: 'gallery_style',
    title: '照片风格',
  };
  const movieDirectorProps: MultiTagProps = { ...tagProps, name: 'movie_director', title: '导演' };
  const movieActorProps: MultiTagProps = { ...tagProps, name: 'movie_actor', title: '演员' };
  const movieStyleProps: MultiTagProps = { ...tagProps, name: 'movie_style', title: '电影风格' };

  /**
   * 定义图片选择的参数
   */
  const photoProps = {
    detail,
    form,
    handlePhotoClear,
    openPhotoPicker,
  };
  const postCoverProps: PhotoPickerItemProps = {
    ...photoProps,
    title: '封面',
    size: '1920*1080',
  };

  return (
    <PageContainer
      extra={[
        <Choose>
          <When condition={!!detail._id}>
            <If condition={detail.post_status === PostStatus.PUBLISHED}>
              <Button type="primary" onClick={() => handleSubmit(PostStatus.PUBLISHED, 'update')}>
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
        </Choose>,
      ]}
    >
      <Card>
        <Form
          form={form}
          onValuesChange={(changedValues) => {
            setDetail({ ...detail, ...changedValues });
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
              <Block title="文章类型">
                <FormItem name="post_type" className={styles.lastMargin}>
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
                      option?.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <For
                      each="option"
                      of={list}
                      body={(option) => (
                        <Select.Option value={option._id} key={option._id}>
                          {creatCategoryTitleByDepth(option.category_title, option)}
                        </Select.Option>
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
          showPhotoPicker={showPhotoPicker}
          handlePhotoPickerOk={handlePhotoPickerOk}
          handlePhotoPickerCancel={handlePhotoPickerCancel}
        />
        <AddCategoryModal modalProps={modalProps} setModalProps={setModalProps} />
      </Card>
    </PageContainer>
  );
};

export default PostDetail;
