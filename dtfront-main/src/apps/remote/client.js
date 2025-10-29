import { logout } from "apps/store/reducers/auth";
import { store } from "apps/store/store";
import axios from "axios";

/*
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);
*/

export default axios;
