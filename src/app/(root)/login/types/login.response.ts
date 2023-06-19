import type { BaseResponse } from '@/types/BaseResponse';

export interface LoginResponse extends BaseResponse<{ isOk: boolean; token: string }> {}
