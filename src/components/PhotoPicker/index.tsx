import React, { useState } from 'react';
import { Modal, message } from 'antd';
import PhotoPickerPanel from '@/pages/media';
import { MediaEntity } from '@/pages/media/types/media.entity';

export interface PhotoPickerModalProps {
  showPhotoPicker: boolean;
  handlePhotoPickerOk: (media: MediaEntity) => void;
  handlePhotoPickerCancel: (e: React.MouseEvent<HTMLElement>) => void;
}

const PhotoPickerModal = (props: PhotoPickerModalProps) => {
  const { showPhotoPicker, handlePhotoPickerOk, handlePhotoPickerCancel } = props;
  const [selectItem, setSelectItem] = useState<MediaEntity>();

  const onSelect = (media: MediaEntity) => {
    setSelectItem(media);
  };

  const onOk = () => {
    if (!selectItem) {
      message.info('请选择图片');
      return;
    }
    handlePhotoPickerOk(selectItem);
  };

  return (
    <Modal
      visible={showPhotoPicker}
      width="90%"
      okText="使用"
      cancelText="取消"
      onOk={onOk}
      onCancel={handlePhotoPickerCancel}
    >
      <PhotoPickerPanel onSelect={onSelect} />
    </Modal>
  );
};

export default PhotoPickerModal;
