import * as appService from '@/services/app.js'
import { history } from 'umi'
import { message } from 'antd'
import { createModel } from 'hox'
import { useState } from 'react'

function UseApp() {
  const [user, setUser] = useState({})
  const [setting, setSetting] = useState({})

  const verify = async () => {
    console.log('app=>model=>verify')
    if (user._id) {
      return
    }
    const result = await appService.verify()
    if (result && result.status === 200) {
      setUser(result.data.list[0])
    }
  }

  const logout = async () => {
    console.log('app=>model=>logout')
    const result = await appService.logout()
    if (result.status === 204) {
      message.success('登出成功')
      setUser({})
      history.push('/login')
    }
  }

  const querySetting = async (force = false) => {
    console.log('app=>model=>querySetting')
    if (!force && setting._id) {
      return
    }
    const result = await appService.setSettingInfo()
    setSetting(result.data)
  }

  return {
    user,
    setting,
    verify,
    logout,
    querySetting,
  }
}

export default createModel(UseApp)
