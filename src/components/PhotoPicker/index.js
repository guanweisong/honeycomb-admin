import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import PhotoPickerPanel from '@/pages/media';

export default class PhotoPickerModal extends PureComponent {
  render () {
    return (
      <Modal
        visible={this.props.showPhotoPicker}
        width='90%'
        okText='使用'
        cancelText='取消'
        onOk={this.props.handlePhotoPickerOk}
        onCancel={this.props.handlePhotoPickerCancel}
      >
        <PhotoPickerPanel />
      </Modal>
    )
  }
}
