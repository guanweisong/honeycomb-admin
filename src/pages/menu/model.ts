import { createModel } from 'hox';
import * as pagesService from '@/pages/page/service';
import * as menusService from './service';
import { useState } from 'react';
import { message } from 'antd';
import type { PageEntity } from '@/pages/page/types/page.entity';
import type { MenuEntity } from '@/pages/menu/types/menu.entity';

function UseMenu() {
  const [pageList, setPageList] = useState<PageEntity[]>([]);
  const [checkedList, setCheckedList] = useState<MenuEntity[]>([]);

  const indexPage = async () => {
    console.log('pages=>model=>index');
    const result = await pagesService.indexPageList();
    if (result.status === 200) {
      setPageList(result.data.list);
    }
  };

  const indexMenu = async () => {
    const result = await menusService.index();
    if (result.status === 200) {
      setCheckedList(result.data.list);
    }
  };

  const updateMenu = async (data: MenuEntity[]) => {
    const result = await menusService.update(data);
    if (result.status === 201) {
      message.success('更新成功');
      indexMenu();
    }
  };

  return {
    pageList,
    checkedList,
    setCheckedList,
    indexPage,
    indexMenu,
    updateMenu,
  };
}

export default createModel(UseMenu);
