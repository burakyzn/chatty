import axios from "axios";
import config from "./config";

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "content-type": "application/json",
  },
})

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization =  token ? `${token}` : '';
  return config;
});

export default api;