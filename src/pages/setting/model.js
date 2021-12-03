import { message } from 'antd'
import { createModel } from 'hox'
import * as settingsService from './service'
import useAppModel from '../../models/app'

function UseSettings() {
  const appModel = useAppModel()

  const update = async (id, payload) => {
    console.log('settings=>model=>update', payload)
    const result = await settingsService.update(id, payload)
    if (result.status === 201) {
      appModel.querySetting(true)
      message.success('更新成功')
    }
  }

  return {
    update,
  }
}

export default createModel(UseSettings)
