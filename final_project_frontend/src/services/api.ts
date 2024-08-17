import axios, { AxiosInstance } from "axios";

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
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 토큰 만료 시 리프레시 토큰으로 갱신
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const res = await axios.post(
          `${REACT_APP_BACKEND_API_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );
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
  signIn: (email: string, password: string) =>
    api.post("/auth/sign-in", { email, password }),
  signUp: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) =>
    api.post("/auth/sign-up", {
      name,
      email,
      password,
      passwordConfirm,
    }),
  googleLogin: (token: string) => api.post("/auth/google", { token }),
  signOut: () => api.post("/auth/sign-out"),
};

export const userApi = {
  findMy: () => api.get("/users/me"),
  update: (
    newUserName: string,
    newPassword: string,
    confirmNewPassword: string
  ) => api.patch("/users/me", { newUserName, newPassword, confirmNewPassword }),
  checkPassword: (password: string) =>
    api.post("/users/check-password", { password }),
  delete: () => api.delete("/users/me"),
};

export const communityApi = {
  findAll: () => api.get("/communities"),
  findById: (id:number) => api.get(`/communities/${id}`),
  findMy: () => api.get("/communities/me"),
};

export const postApi = {
  create: (content: string, image?: File) => {
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);
    return api.post('/posts', formData);
  },
  getPosts: () => api.get('/posts'), 
  like: (postId: string) => api.post(`/posts/${postId}/like`),
  comment: (postId: string, content: string) => api.post(`/posts/${postId}/comments`, { content }),
};

export const liveApi = {
  createLive: (artistId: string, title: string, liveType: string) =>
    api.post('/live', { artistId, title, liveType }),
  findAllLives: (communityId: string) => api.get(`/live/community/${communityId}`),
  watchLive: (liveId: number) => api.get(`/live/${liveId}`),
};