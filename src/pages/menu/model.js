import { createModel } from 'hox'
import * as pagesService from '@/pages/page/service'
import * as menusService from './service'
import { useState } from 'react'
import { message } from 'antd'

function UseMenu() {
  const [pageList, setPageList] = useState([])
  const [checkedList, setCheckedList] = useState([])

  const indexPage = async () => {
    console.log('pages=>model=>index')
    const result = await pagesService.index({})
    if (result.status === 200) {
      setPageList(result.data.list)
    }
  }

  const indexMenu = async () => {
    const result = await menusService.index({})
    if (result.status === 200) {
      setCheckedList(result.data.list)
    }
  }

  const updateMenu = async (data) => {
    const result = await menusService.update(data)
    if (result.status === 201) {
      indexMenu()
      message.success('更新成功')
    }
  }

  return {
    pageList,
    checkedList,
    setCheckedList,
    indexPage,
    indexMenu,
    updateMenu,
  }
}

export default createModel(UseMenu)
