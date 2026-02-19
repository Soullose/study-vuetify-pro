import { post, get } from '../index';

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  captchaKey?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: UserInfo;
}

export interface UserInfo {
  id: string | number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roles: string[];
  permissions: string[];
  deptId?: string | number;
  postId?: string | number;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface CaptchaResult {
  captchaKey: string;
  captchaImage: string;
}

/**
 * 用户登录
 */
export function login(data: LoginParams): Promise<LoginResult> {
  return post<LoginResult>('/auth/login', data);
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<void>('/auth/logout');
}

/**
 * 刷新 Token
 */
export function refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
  return post<RefreshTokenResult>('/auth/refresh', { refreshToken });
}

/**
 * 获取当前用户信息
 */
export function getUserInfo(): Promise<UserInfo> {
  return get<UserInfo>('/auth/user-info');
}

/**
 * 获取验证码
 */
export function getCaptcha(): Promise<CaptchaResult> {
  return get<CaptchaResult>('/auth/captcha');
}

/**
 * 修改密码
 */
export function changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
  return post<void>('/auth/change-password', data);
}
