import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '//127.0.0.1:7002' : '//api.guanweisong.com',
  withCredentials: true,
  timeout: 10000,
  headers: {},
});

instance.interceptors.request.use((config) => {
  config.headers['x-auth-token'] = localStorage.getItem('token');
  return config;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
        case 403:
        case 500:
          message.error(err.response.data.message);
          break;
        default:
          message.error('系统错误，请稍后再试');
      }
    } else {
      message.error('网络错误，请稍后再试');
    }
    return Promise.reject(err);
  },
);

export default instance;
