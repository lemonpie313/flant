import axios from 'axios';
import { User, CreateUserDto, UpdateUserDto } from '../types/user';

const API_BASE_URL = 'http://localhost:3000'; // 백엔드 서버 주소

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getOne: (id: number) => api.get<User>(`/users/${id}`),
  create: (userData: CreateUserDto) => api.post<User>('/users', userData),
  update: (id: number, userData: UpdateUserDto) => api.put<User>(`/users/${id}`, userData),
  remove: (id: number) => api.delete(`/users/${id}`),
};

export const authApi = {
  login: (username: string, password: string) => 
    api.post('/login', { username, password }),
  logout: () => api.post('/logout'),
};
