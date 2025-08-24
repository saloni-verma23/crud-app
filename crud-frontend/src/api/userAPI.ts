import axios from 'axios';

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

type SearchParams = {
  query: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
};

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/users`,
});

export const getUsers = async ({ page = 1, limit = 10, sortBy = 'created_at', order = 'desc' }) => {
  try {
    const response = await API.get('/', {
      params: { page, limit, sortBy, order },
    });
    const totalUsers = response.data.meta.totalUsers;
    return { users: response.data.data, totalUsers };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getUserById = async (id: number) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user by ID');
    throw error;
  }
};

export const searchUsers = async ({ query, page, limit, sortBy, order }: SearchParams) => {
  try {
    const response = await API.get('/search', { params: { query, page, limit, sortBy, order } });
    const totalUsers = response.data.meta.totalUsers;
    return { users: response.data.data || [], totalUsers };
  } catch (error) {
    console.error('Error searching users');
    return { users: [], totalUsers: 0 };
  }
};

export const createUser = async (data: User) => {
  try {
    const response = await API.post('/', data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating user');
    throw error;
  }
};

export const updateUser = async (id: number, data: User) => {
  try {
    const response = await API.put(`/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user');
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    await API.delete(`/${id}`);
  } catch (error) {
    console.error('Error deleting user');
    throw error;
  }
};
