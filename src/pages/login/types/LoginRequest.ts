import type { CaptchaType } from '@/pages/login/types/CaptchaType';

export interface LoginRequest {
  user_name: string;
  user_passport: string;
  captcha: CaptchaType;
}
