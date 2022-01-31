import React from 'react';
import { Button, Input, Form } from 'antd';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import Block from '@/pages/post/edit/components/Block';
import styles from './index.less';
import type { MediaReadOnly, PostEntity } from '@/pages/post/types/post.entity';

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
  const mediaObj = detail['post_cover'] as MediaReadOnly;

  return (
    <Block title={title} tip={`（尺寸：${size}）`}>
      <FormItem name={name} style={{ display: 'none' }}>
        <Input type="text" />
      </FormItem>
      <Choose>
        <When condition={mediaObj._id}>
          <div className={styles.coverWrap}>
            <img src={`//${mediaObj.media_url}`} />
          </div>
          <Button onClick={() => handlePhotoClear()} className={styles.rightButton}>
            <DeleteOutlined />
            清除图片
          </Button>
          <Button onClick={() => openPhotoPicker()}>
            <UploadOutlined />
            重新上传
          </Button>
        </When>
        <Otherwise>
          <Button onClick={() => openPhotoPicker()}>
            <UploadOutlined />
            点击上传
          </Button>
        </Otherwise>
      </Choose>
    </Block>
  );
};

export default PhotoPickerItem;
