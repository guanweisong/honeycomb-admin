import type { BaseResponse } from '@/types/BaseResponse';

export interface PaginationResponse<T>
  extends BaseResponse<{
    total: number;
    list: T;
  }> {}
