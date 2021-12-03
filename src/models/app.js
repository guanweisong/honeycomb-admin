import * as appService from '@/services/app.js'
import { history } from 'umi'
import { message } from 'antd'
import { createModel } from 'hox'
import { useState } from 'react'

function UseApp() {
  const [user, setUser] = useState()
  const [setting, setSetting] = useState({})

  const verify = async () => {
    console.log('app=>model=>verify')
    if (user?._id) {
      return
    }
    appService.verify().then(result => {
      setUser(result.data)
    }).catch(() => {
      setUser(false)
    })
  }

  const logout = async () => {
    console.log('app=>model=>logout')
    const result = await appService.logout()
    if (result.status === 200 && result.data.OK) {
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
    setSetting(result.data[0])
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
