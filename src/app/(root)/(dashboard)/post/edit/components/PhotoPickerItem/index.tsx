'use client';

import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import type { MediaReadOnly, PostEntity } from '../../../types/post.entity';
import Block from '../Block';

const FormItem = Form.Item;

export interface PhotoPickerItemProps {
  detail: PostEntity;
  title: string;
  size: string;
  handlePhotoClear: () => void;
  openPhotoPicker: () => void;
}

const PhotoPickerItem = (props: PhotoPickerItemProps) => {
  const { detail, title, size, handlePhotoClear, openPhotoPicker } = props;
  const mediaObj = detail['cover'] as MediaReadOnly;

  return (
    <Block title={title} tip={`（尺寸：${size}）`}>
      <FormItem name={'cover'} style={{ display: 'none' }}>
        <Input type="text" />
      </FormItem>
      {mediaObj?.id ? (
        <>
          <div className="mb-2 text-center bg-gray-300">
            <img src={mediaObj.url} className="max-w-full max-h-full block" />
          </div>
          <Button onClick={() => handlePhotoClear()} className="float-right">
            <DeleteOutlined />
            清除图片
          </Button>
          <Button onClick={() => openPhotoPicker()}>
            <UploadOutlined />
            重新上传
          </Button>
        </>
      ) : (
        <Button onClick={() => openPhotoPicker()}>
          <UploadOutlined />
          点击上传
        </Button>
      )}
    </Block>
  );
};

export default PhotoPickerItem;
