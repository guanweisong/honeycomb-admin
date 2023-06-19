import type { CaptchaType } from './CaptchaType';

export interface LoginRequest {
  user_name: string;
  user_passport: string;
  captcha: CaptchaType;
}
