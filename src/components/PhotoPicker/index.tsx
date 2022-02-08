import React from 'react';
import { Modal } from 'antd';
import PhotoPickerPanel from '@/pages/media';

export interface PhotoPickerModalProps {
  showPhotoPicker: boolean;
  handlePhotoPickerOk: (e: React.MouseEvent<HTMLElement>) => void;
  handlePhotoPickerCancel: (e: React.MouseEvent<HTMLElement>) => void;
}

const PhotoPickerModal = (props: PhotoPickerModalProps) => {
  const { showPhotoPicker, handlePhotoPickerOk, handlePhotoPickerCancel } = props;
  return (
    <Modal
      visible={showPhotoPicker}
      width="90%"
      okText="使用"
      cancelText="取消"
      onOk={handlePhotoPickerOk}
      onCancel={handlePhotoPickerCancel}
    >
      <PhotoPickerPanel />
    </Modal>
  );
};

export default PhotoPickerModal;
