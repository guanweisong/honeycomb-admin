import { useEffect, useState } from 'react';
import { Card, Input, Button, Select, DatePicker, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { If, Choose, When, Otherwise, For } from 'tsx-control-statements/components';
import SimpleMDE from 'react-simplemde-editor';
import { PageContainer } from '@ant-design/pro-layout';
import { StringParam, useQueryParams } from 'use-query-params';
import PhotoPickerModal from '@/components/PhotoPicker';
import styles from './index.less';
import type { MultiTagProps } from './components/MultiTag';
import MultiTag from './components/MultiTag';
import AddCategoryModal from '../category/components/AddCategoryModal';
import type { PhotoPickerItemProps } from './components/PhotoPickerItem';
import PhotoPickerItem from './components/PhotoPickerItem';
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
import type { CategoryEntity } from '@/pages/post/category/types/category.entity';
import * as tagsService from '@/pages/tag/service';
import * as categoryService from '@/pages/post/category/service';
import type { MediaEntity } from '@/pages/media/types/media.entity';
import showdown from 'showdown';

const converter = new showdown.Converter();

const FormItem = Form.Item;
const { TextArea } = Input;

const PostDetail = () => {
  const { initialState } = useModel('@@initialState');
  // @ts-ignore
  const [detail, setDetail] = useState<PostEntity>({ type: PostType.ARTICLE });
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
    id: StringParam,
  });

  const { id } = query;

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
    if (typeof values.id !== 'undefined') {
      result = await postsService.indexPostDetail(values);
      result = result.data;
      if (result.movieTime) {
        // @ts-ignore
        result.movieTime = moment(result.movieTime);
      }
      if (result.galleryTime) {
        // @ts-ignore
        result.galleryTime = moment(result.movie_time);
      }
      if (result.content) {
        result.content = converter.makeMarkdown(result.content);
      }
      setDetail(result);
    }
  };

  useEffect(() => {
    if (id) {
      indexDetail({ id });
    }
    return () => {
      // @ts-ignore
      setDetail({ type: PostType.ARTICLE });
    };
  }, [id]);

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
  const getTagsValue = (values: Omit<TagEntity, 'createdAt' | 'updatedAt'>[]) => {
    const result: string[] = [];
    values.forEach((item) => {
      result.push(item.id);
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
      data.status = status;
      if (data.galleryStyles) {
        data.galleryStyleIds = getTagsValue(data.galleryStyles);
        delete data.galleryStyles;
      }
      if (data.movieDirectors) {
        data.movieDirectorIds = getTagsValue(data.movieDirectors);
        delete data.movieDirectors;
      }
      if (data.movieActors) {
        data.movieActorIds = getTagsValue(data.movieActors);
        delete data.movieActors;
      }
      if (data.movieStyles) {
        data.movieStyleIds = getTagsValue(data.movieStyles);
        delete data.movieStyles;
      }
      if (
        [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(data.type) &&
        !data.cover?.id
      ) {
        message.error('请上传封面');
        return;
      }
      if (data.cover) {
        data.coverId = data.cover.id;
        delete data.cover;
      }
      switch (type) {
        case 'create':
          data.authorId = userInfo!.id;
          console.log('create', data);
          const createResult = await postsService.create(data);
          if (createResult.status === 201) {
            message.success('添加成功');
            history.push({
              pathname: '/post/edit',
              query: {
                id: createResult.data.id,
              },
            });
          }
          break;
        case 'update':
          console.log('update', detail!.id, data);
          const updateResult = await postsService.update(detail!.id, data);
          if (updateResult.status === 201) {
            message.success('更新成功');
            indexDetail({ id: detail!.id });
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
    name: 'movieActors' | 'movieDirectors' | 'movieStyles' | 'galleryStyles',
    tag_name: string,
  ) => {
    const result = await tagsService.create({ name: tag_name });
    if (result && result.status === 201) {
      setDetail({
        ...detail,
        // @ts-ignore
        [name]: [...(detail[name] ?? []), { id: result.data.id, tag_name: result.data.tag_name }],
      } as PostEntity);
    }
  };

  /**
   * 更新tag
   * @param name
   * @param tags
   */
  const onUpdateTags = (
    name: 'movieActors' | 'movieDirectors' | 'movieStyles' | 'galleryStyles',
    tags: Omit<TagEntity, 'updatedAt' | 'createdAt'>[],
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
  const handlePhotoPickerOk = (media: MediaEntity) => {
    setDetail({ ...detail, cover: media, coverId: media.id } as PostEntity);
    handlePhotoPickerCancel();
  };

  /**
   * 清空图片选择器的图片
   * @param type
   */
  const handlePhotoClear = () => {
    const { cover, ...rest } = detail as PostEntity;
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
  };
  const galleryStyleProps: MultiTagProps = {
    ...tagProps,
    name: 'galleryStyles',
    title: '照片风格',
  };
  const movieDirectorProps: MultiTagProps = { ...tagProps, name: 'movieDirectors', title: '导演' };
  const movieActorProps: MultiTagProps = { ...tagProps, name: 'movieActors', title: '演员' };
  const movieStyleProps: MultiTagProps = { ...tagProps, name: 'movieStyles', title: '电影风格' };

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
          <When condition={!!detail?.id}>
            <If condition={detail.status === PostStatus.PUBLISHED}>
              <Button type="primary" onClick={() => handleSubmit(PostStatus.PUBLISHED, 'update')}>
                更新
              </Button>
            </If>
            <If condition={detail.status === PostStatus.DRAFT}>
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
                  [PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(detail.type) ||
                  !detail.type
                }
              >
                <FormItem name="title" rules={[{ required: true, message: '请输入标题' }]}>
                  <Input type="text" size="large" placeholder="在此输入文章标题" maxLength={20} />
                </FormItem>
                <FormItem
                  name="content"
                  rules={[
                    { max: 20000, message: '最多只能输入20000个字符' },
                    { required: true, message: '请输入内容' },
                  ]}
                >
                  <SimpleMDE className="markdown-body" />
                </FormItem>
                <FormItem name="excerpt">
                  <TextArea rows={4} placeholder="内容简介" maxLength={200} />
                </FormItem>
              </If>
              <If condition={[PostType.QUOTE].includes(detail.type)}>
                <FormItem name="quoteContent" rules={[{ required: true, message: '请输入内容' }]}>
                  <TextArea rows={4} placeholder="请输入话语" maxLength={500} />
                </FormItem>
                <FormItem name="quoteAuthor" rules={[{ required: true, message: '请输入作者名' }]}>
                  <Input type="text" size="large" placeholder="请输入作者" max={50} />
                </FormItem>
              </If>
            </div>
            <div className={styles.sider}>
              <Block title="文章类型">
                <FormItem name="type" className={styles.lastMargin}>
                  <Select options={postTypeOptions} />
                </FormItem>
              </Block>
              <Block title="分类目录">
                <FormItem name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
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
                        <Select.Option value={option.id} key={option.id}>
                          {creatCategoryTitleByDepth(option.title, option)}
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
                  detail.type,
                )}
              >
                <PhotoPickerItem {...postCoverProps} />
              </If>
              <If condition={detail.type === PostType.MOVIE}>
                <Block title="电影英文名">
                  <FormItem name="movieNameEn" className={styles.lastMargin}>
                    <Input type="text" placeholder="请输入英文名" />
                  </FormItem>
                </Block>
                <Block title="上映年代">
                  <FormItem name="movieTime" className={styles.lastMargin}>
                    <DatePicker placeholder="请选择上映年代" />
                  </FormItem>
                </Block>
                <MultiTag {...movieDirectorProps} />
                <MultiTag {...movieActorProps} />
                <MultiTag {...movieStyleProps} />
              </If>
              <If condition={detail.type === PostType.PHOTOGRAPH}>
                <Block title="拍摄地点">
                  <FormItem name="galleryLocation" className={styles.lastMargin}>
                    <Input type="text" placeholder="请填写地址" />
                  </FormItem>
                </Block>
                <Block title="拍摄时间">
                  <FormItem name="galleryTime" className={styles.lastMargin}>
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
