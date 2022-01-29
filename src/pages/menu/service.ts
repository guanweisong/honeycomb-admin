import request from '@/utils/request';
import type { MenuIndexResponse } from '@/pages/menu/types/menu.index.response';
import type { MenuEntity } from '@/pages/menu/types/menu.entity';

export const index = (): Promise<MenuIndexResponse> => {
  console.log('menus=>service=>index');
  return request({
    url: '/menus',
    method: 'get',
  }).then((result: MenuIndexResponse) => {
    result.data.list = result.data.list.map((item) => ({ ...item, parent: item.parent || '0' }));
    return result;
  });
};

export const update = (params: MenuEntity[]) => {
  console.log('menus=>service=>update', params);
  return request({
    url: `/menus`,
    method: 'patch',
    data: params,
  });
};
