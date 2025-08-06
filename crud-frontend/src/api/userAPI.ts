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

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/users`,
});

export const getUsers = async () => {
  try {
    const response = await API.get('/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUser = async (data: User) => {
  try {
    const response = await API.post('/', data);
    console.log('User created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating user');
    throw error;
  }
};

export const updateUser = async (id: number, data: User) => {
  try {
    const response = await API.put(`/${id}`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user');
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await API.delete(`/${id}`);
    console.log(response.data);
  } catch (error) {
    console.error('Error deleting user');
    throw error;
  }
};
