import React from 'react'
import { Modal } from 'antd'
import PhotoPickerPanel from '@/pages/media'

const PhotoPickerModal = (props) => {
  return (
    <Modal
      visible={props.showPhotoPicker}
      width="90%"
      okText="使用"
      cancelText="取消"
      onOk={props.handlePhotoPickerOk}
      onCancel={props.handlePhotoPickerCancel}
    >
      <PhotoPickerPanel />
    </Modal>
  )
}

export default PhotoPickerModal
