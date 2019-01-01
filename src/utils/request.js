import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:7001',
  withCredentials: true,
  timeout: 10000,
  headers: {},
});


instance.interceptors.response.use(res=>{
  return res;
}, err => {
  switch (err.response.status) {
    case 401:
    case 403:
      message.error(err.response.data.error);
      break;
    default: message.error('操作失败，请稍后再试');
  }
})

export default instance;
