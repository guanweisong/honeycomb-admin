import { message } from 'antd'
import { history } from 'umi'
import { createModel } from 'hox'
import { useState } from 'react'
import * as loginService from './service'

function UseLogin() {
  const [loading, setLoading] = useState(false)

  /**
   * 登录
   */
  const login = async ({ targetUrl, ...rest }) => {
    setLoading(true)
    const result = await loginService.login(rest)
    setLoading(false)
    if (result && result.status === 200) {
      message.success('登陆成功')
      history.replace(targetUrl || '/')
    }
  }

  return {
    loading,
    login,
  }
}

export default createModel(UseLogin)
