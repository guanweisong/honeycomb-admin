import request from '@/utils/request';
import type { MenuEntity } from './types/menu.entity';
import type { MenuIndexResponse } from './types/menu.index.response';

export default class MenuService {
  static index = (): Promise<MenuIndexResponse> => {
    console.log('menu=>service=>index');
    return request({
      url: '/menu',
      method: 'get',
    }).then((result: MenuIndexResponse) => {
      result.data.list = result.data.list.map((item) => ({ ...item, parent: item.parent || '0' }));
      return result;
    });
  };

  static update = (params: MenuEntity[]) => {
    console.log('menu=>service=>update', params);
    return request({
      url: `/menu`,
      method: 'patch',
      data: params,
    });
  };
}
