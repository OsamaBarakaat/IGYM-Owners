import axios from "axios";

const BASE_URL = process.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: 'https://api.igymsystem.com',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const privateAxiosInstance = axios.create({
  baseURL: 'https://api.igymsystem.com',
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;
