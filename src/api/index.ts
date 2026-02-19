import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 通用响应结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Token 存储 Key
const TOKEN_KEY = 'access_token';

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 Token
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加租户 ID（如需要）
    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId && config.headers) {
      config.headers['X-Tenant-Id'] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 业务状态码判断
    if (data.code === 0 || data.code === 200) {
      return response;
    }

    // 业务错误处理
    handleBusinessError(data.code, data.message);
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  (error) => {
    const { response } = error;

    if (!response) {
      // 网络错误
      return Promise.reject(new Error('网络连接失败，请检查网络'));
    }

    const { status, data } = response;

    switch (status) {
      case 401:
        // Token 过期，清除登录状态并跳转登录页
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        window.location.href = '/login';
        return Promise.reject(new Error('登录已过期，请重新登录'));

      case 403:
        return Promise.reject(new Error('没有权限访问该资源'));

      case 404:
        return Promise.reject(new Error('请求的资源不存在'));

      case 500:
        return Promise.reject(new Error('服务器内部错误'));

      default:
        return Promise.reject(error);
    }
  }
);

// 业务错误处理
function handleBusinessError(code: number, message: string) {
  console.error(`业务错误 [${code}]: ${message}`);
}

// 通用请求方法
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service.request<any, AxiosResponse<ApiResponse<T>>>(config).then((res) => res.data.data);
}

export function get<T = any>(url: string, params?: object): Promise<T> {
  return request<T>({ method: 'GET', url, params });
}

export function post<T = any>(url: string, data?: object): Promise<T> {
  return request<T>({ method: 'POST', url, data });
}

export function put<T = any>(url: string, data?: object): Promise<T> {
  return request<T>({ method: 'PUT', url, data });
}

export function del<T = any>(url: string, params?: object): Promise<T> {
  return request<T>({ method: 'DELETE', url, params });
}

export default service;
