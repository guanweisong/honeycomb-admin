import type { BaseResponse } from '@/types/BaseResponse';

export interface LoginResponse extends BaseResponse<{ OK: boolean; token: string }> {}
