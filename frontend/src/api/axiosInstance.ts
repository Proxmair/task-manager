import axios from 'axios';
import { toast } from 'react-toastify';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);
