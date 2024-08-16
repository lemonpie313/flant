import axios, { AxiosInstance } from "axios";
import { UpdateUserDto } from "../types/user";

// 환경 변수에서 설정 가져오기
const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const API_TIMEOUT = Number(process.env.API_TIMEOUT);

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: REACT_APP_BACKEND_API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

// 요청 인터셉터를 추가하여 JWT 토큰을 헤더에 포함시킵니다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accestoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 토큰 만료 시 리프레시 토큰으로 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const res = await axios.post(`${REACT_APP_BACKEND_API_URL}/auth/refresh`, {
          refreshToken,
        });
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Unable to refresh token", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  googleLogin: (token: string) => api.post("/auth/google", { token }),
  logout: () => api.post("/auth/logout"),
  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),
};

export const userApi = {
  update: (userId: number, userData: UpdateUserDto) =>
    api.put(`/users/${userId}`, userData),
};
