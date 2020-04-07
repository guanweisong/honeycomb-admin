import React from 'react'
import { Button, Input, Form } from 'antd'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'

const FormItem = Form.Item

const PhotoPickerItem = (props) => {
  const { styles, detail, name, title, size } = props
  return (
    <dl className={styles.block}>
      <dt className={styles.blockTitle}>
        {title}
        <span className={styles.blockTitleTip}>（尺寸：{size}）</span>
      </dt>
      <dd className={styles.blockContent}>
        <FormItem name={name} style={{ display: 'none' }}>
          <Input type="text" />
        </FormItem>
        <Choose>
          <When condition={detail[name]._id}>
            <div className={styles.coverWrap}>
              <img src={`//${detail[name].media_url}`} />
            </div>
            <Button onClick={() => props.handlePhotoClear(name)} className={styles.rightButton}>
              <DeleteOutlined />
              清除图片
            </Button>
            <Button onClick={() => props.openPhotoPicker(name)}>
              <UploadOutlined />
              重新上传
            </Button>
          </When>
          <Otherwise>
            <Button onClick={() => props.openPhotoPicker(name)}>
              <UploadOutlined />
              点击上传
            </Button>
          </Otherwise>
        </Choose>
      </dd>
    </dl>
  )
}

export default PhotoPickerItem
