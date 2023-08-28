'use client';

import type { MediaEntity } from '@/app/(root)/(dashboard)/media/types/media.entity';
import PostService from '@/app/(root)/(dashboard)/post/service';
import TagService from '@/app/(root)/(dashboard)/tag/service';
import type { TagEntity } from '@/app/(root)/(dashboard)/tag/types/tag.entity';
import PhotoPickerModal from '@/components/PhotoPicker';
import { ModalType } from '@/types/ModalType';
import { creatCategoryTitleByDepth } from '@/utils/help';
import { PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, PageContainer } from '@ant-design/pro-components';
import { Button, Card, DatePicker, Form, Input, Select, message } from 'antd';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import showdown from 'showdown';
import AddCategoryModal from '../category/components/AddCategoryModal';
import CategoryService from '../category/service';
import type { CategoryEntity } from '../category/types/category.entity';
import Block from '../edit/components/Block';
import { PostStatus } from '../types/PostStatus';
import { PostType, postTypeOptions } from '../types/PostType';
import type { PostEntity } from '../types/post.entity';
import type { MultiTagProps } from './components/MultiTag';
import MultiTag from './components/MultiTag';
import type { PhotoPickerItemProps } from './components/PhotoPickerItem';
import PhotoPickerItem from './components/PhotoPickerItem';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const converter = new showdown.Converter();

const FormItem = Form.Item;
const { TextArea } = Input;

const PostDetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // @ts-ignore
  const [detail, setDetail] = useState<PostEntity>({ type: PostType.ARTICLE });
  const [list, setList] = useState<CategoryEntity[]>([]);
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<{
    type?: ModalType;
    open: boolean;
    record?: CategoryEntity;
  }>({
    type: ModalType.ADD,
    open: false,
  });

  const [form] = Form.useForm();

  const id = searchParams.get('id');

  /**
   * 分类列表获取
   */
  const index = async () => {
    const result = await CategoryService.index({ limit: 9999 });
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
      result = await PostService.indexPostDetail(values);
      result = result.data;
      if (result.movieTime) {
        // @ts-ignore
        result.movieTime = dayjs(result.movieTime);
      }
      if (result.galleryTime) {
        // @ts-ignore
        result.galleryTime = dayjs(result.galleryTime);
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
          console.log('create', data);
          const createResult = await PostService.create(data);
          if (createResult.status === 201) {
            message.success('添加成功');
            router.push(`/post/edit?id=${createResult.data.id}`);
          }
          break;
        case 'update':
          console.log('update', detail!.id, data);
          const updateResult = await PostService.update(detail!.id, data);
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
    const result = await TagService.create({ name: tag_name });
    if (result && result.status === 201) {
      setDetail({
        ...detail,
        [name]: [...(detail[name] ?? []), { id: result.data.id, name: result.data.name }],
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
      open: true,
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

  /**
   * 计算按钮状态
   */
  const getBtns = () => {
    const btns = [];
    if (!!detail?.id) {
      if (detail.status === PostStatus.PUBLISHED) {
        btns.push(
          <Button type="primary" onClick={() => handleSubmit(PostStatus.PUBLISHED, 'update')}>
            更新
          </Button>,
        );
      }
      if (detail.status === PostStatus.DRAFT) {
        btns.push(
          <Button
            type="primary"
            className="float-right"
            onClick={() => handleSubmit(PostStatus.PUBLISHED, 'update')}
          >
            发布
          </Button>,
          <Button onClick={() => handleSubmit(PostStatus.DRAFT, 'update')}>保存</Button>,
        );
      }
    } else {
      btns.push(
        <Button type="primary" onClick={() => handleSubmit(PostStatus.PUBLISHED, 'create')}>
          发布
        </Button>,
        <Button onClick={() => handleSubmit(PostStatus.DRAFT, 'create')}>保存草稿</Button>,
      );
    }
    return btns;
  };

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          onValuesChange={(changedValues) => {
            setDetail({ ...detail, ...changedValues });
          }}
        >
          <div className="flex">
            <div className="flex-1">
              {([PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(detail.type) ||
                !detail.type) && (
                <>
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
                </>
              )}
              {[PostType.QUOTE].includes(detail.type) && (
                <>
                  <FormItem name="quoteContent" rules={[{ required: true, message: '请输入内容' }]}>
                    <TextArea rows={4} placeholder="请输入话语" maxLength={500} />
                  </FormItem>
                  <FormItem
                    name="quoteAuthor"
                    rules={[{ required: true, message: '请输入作者名' }]}
                  >
                    <Input type="text" size="large" placeholder="请输入作者" max={50} />
                  </FormItem>
                </>
              )}
            </div>
            <div className="w-80 ml-8">
              <Block title="文章类型">
                <FormItem name="type" className="mb-0">
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
                    {list.map((option) => (
                      <Select.Option value={option.id} key={option.id}>
                        {creatCategoryTitleByDepth(option.title, option)}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
                <Button type="dashed" onClick={handleAddNewCategory}>
                  <PlusOutlined />
                  新建分类
                </Button>
              </Block>
              {[PostType.ARTICLE, PostType.MOVIE, PostType.PHOTOGRAPH].includes(detail.type) && (
                <PhotoPickerItem {...postCoverProps} />
              )}
              {detail.type === PostType.MOVIE && (
                <>
                  <Block title="电影英文名">
                    <FormItem name="movieNameEn" className="mb-0">
                      <Input type="text" placeholder="请输入英文名" />
                    </FormItem>
                  </Block>
                  <Block title="上映年代">
                    <FormItem name="movieTime" className="mb-0">
                      <DatePicker placeholder="请选择上映年代" />
                    </FormItem>
                  </Block>
                  <MultiTag {...movieDirectorProps} />
                  <MultiTag {...movieActorProps} />
                  <MultiTag {...movieStyleProps} />
                </>
              )}
              {detail.type === PostType.PHOTOGRAPH && (
                <>
                  <Block title="拍摄地点">
                    <FormItem name="galleryLocation" className="mb-0">
                      <Input type="text" placeholder="请填写地址" />
                    </FormItem>
                  </Block>
                  <Block title="拍摄时间">
                    <FormItem name="galleryTime" className="mb-0">
                      <DatePicker placeholder="请选择拍摄时间" />
                    </FormItem>
                  </Block>
                  <MultiTag {...galleryStyleProps} />
                </>
              )}
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
      <FooterToolbar>{getBtns()}</FooterToolbar>
    </PageContainer>
  );
};

export default PostDetail;
