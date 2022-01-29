import type { PaginationResponse } from '@/types/PaginationResponse';
import type { MenuEntity } from '@/pages/menu/types/menu.entity';

export interface MenuIndexResponse extends PaginationResponse<MenuEntity[]> {}
