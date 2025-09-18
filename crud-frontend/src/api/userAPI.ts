// src/api/userAPI.ts
import api from './client';

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  dob: string;
  mobile: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

interface GetUsersParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const getUsers = async ({
  query,
  page = 1,
  limit = 10,
  sortBy = 'created_at',
  order = 'desc',
}: GetUsersParams) => {
  const response = await api.get('/users', {
    params: { query, page, limit, sortBy, order },
  });
  const totalUsers = response.data.data.totalUsers;
  return { users: response.data.data.users || [], totalUsers };
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

export const createUser = async (data: User) => {
  const response = await api.post('/users', data);
  return response.data.data;
};

export const updateUser = async (id: number, data: User) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};
