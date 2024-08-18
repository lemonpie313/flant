import axios, { AxiosInstance, AxiosResponse } from "axios";

// 환경 변수에서 설정 가져오기
const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const API_TIMEOUT = Number(process.env.API_TIMEOUT);

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: REACT_APP_BACKEND_API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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
        const res = await axios.post(`${REACT_APP_BACKEND_API_URL}/auth/refresh`, { refreshToken });
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.accessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Unable to refresh token", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// 공통 에러 처리 함수
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data);
    // 여기에 사용자에게 에러 메시지를 표시하는 로직 추가
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
};

export const authApi = {
  signIn: (email: string, password: string) =>
    api.post("/auth/sign-in", { email, password }).catch(handleApiError),
  signUp: (name: string, email: string, password: string, passwordConfirm: string) =>
    api.post("/auth/sign-up", { name, email, password, passwordConfirm }).catch(handleApiError),
  googleLogin: (token: string) => api.post("/auth/google", { token }).catch(handleApiError),
  signOut: () => api.post("/auth/sign-out").catch(handleApiError),
};

export const userApi = {
  findMy: () => api.get("/users/me").catch(handleApiError),
  update: (newUserName: string, newPassword: string, confirmNewPassword: string) =>
    api.patch("/users/me", { newUserName, newPassword, confirmNewPassword }).catch(handleApiError),
  checkPassword: (password: string) =>
    api.post("/users/check-password", { password }).catch(handleApiError),
  delete: () => api.delete("/users/me").catch(handleApiError),
};

export const communityApi = {
  findAll: () => api.get("/communities").catch(handleApiError),
  findOne: (id: number) => api.get(`/communities/${id}`).catch(handleApiError),
  findMy: () => api.get("/communities/me").catch(handleApiError),
};

export const postApi = {
  create: (formData: FormData) =>
    api.post(`/posts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).catch(handleApiError),
  getPosts: (communityId: number, page = 1, limit = 10) =>
    api.get(`/posts`, { params: { communityId, page, limit } }).catch(handleApiError),
  like: (postId: number,{ status }: { status: number }) => api.put(`/posts/${postId}/likes`,{status}).catch(handleApiError),
  checkIfUserLikedPost: (id: number) => api.get(`/posts/${id}/likes/my`).catch(handleApiError),
};

export const commentApi = {
  create: ({ postId, content }: { postId: number; content: string }) =>
    api.post(`/posts/${postId}/comments`, { content }).catch(handleApiError),
  createReply: (commentId: number, { content }: { content: string }) =>
    api.post(`/comments/${commentId}/replies`, { content }).catch(handleApiError),
  getComments: (postId: number, page = 1, limit = 10) =>
    api.get(`/posts/${postId}/comments`, { params: { page, limit } }).catch(handleApiError),
  like: (id: number,{ status }: { status: number }) => api.put(`/comments/${id}/likes`,{status}).catch(handleApiError),
  checkIfUserLikedComment: (id: number) => api.get(`/comments/${id}/likes/my`).catch(handleApiError),
};

export const liveApi = {
  createLive: (artistId: string, title: string, liveType: string) =>
    api.post('/live', { artistId, title, liveType }).catch(handleApiError),
  findAllLives: (communityId: string) => api.get(`/live/community/${communityId}`).catch(handleApiError),
  watchLive: (liveId: number) => api.get(`/live/${liveId}`).catch(handleApiError),
};


export const merchandiseApi = {
  // 카테고리 조회 API
  fetchCategories: (communityId: number) =>
    api.get(`/merchandise/category`, { params: { communityId } }),

  // 상품 전체 조회 API
  fetchMerchandises: (communityId: number, merchandiseCategoryId: number) =>
    api.get(`/merchandise`, {
      params: { communityId, merchandiseCategoryId },
    }),

  // 상품 상세 조회 API
  fetchMerchandiseDetail: (merchandiseId: number) =>
    api.get(`/merchandise/${merchandiseId}`),
};