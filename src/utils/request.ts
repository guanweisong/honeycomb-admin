import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: 'https://api.guanweisong.com',
  withCredentials: true,
  timeout: 10000,
  headers: {},
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers!['x-auth-token'] = token;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          message.error(err.response.data.message[0]);
          break;
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
