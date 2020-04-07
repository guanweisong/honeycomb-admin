import { message } from 'antd'
import { createModel } from 'hox'
import { useState } from 'react'
import * as commentsService from './service'

function UseComment() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const index = async (values) => {
    console.log('comments=>model=>index', values)
    setLoading(true)
    const result = await commentsService.index(values)
    if (result.status === 200) {
      setList(result.data.list)
      setTotal(result.data.total)
    }
    setLoading(false)
  }

  const update = async (id, values) => {
    console.log('comments=>model=>update', id, values)
    const result = await commentsService.update(id, values)
    if (result.status === 201) {
      index()
      message.success('更新成功')
    }
  }

  const distory = async (id) => {
    console.log('comments=>model=>distory', id)
    const result = await commentsService.distory(id)
    if (result.status === 204) {
      index()
      message.success('删除成功')
    }
  }

  return {
    list,
    total,
    loading,
    index,
    update,
    distory,
  }
}

export default createModel(UseComment)
