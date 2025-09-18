import { Response } from "express";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  dob: Date;
  mobile: string;
  address: string;
  created_at: Date;
}

export interface GetAllUsersParams {
  query?: string;
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  order?: "asc" | "desc" | string;
}

export interface UserQueryParams {
  query?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  status?: number;
}

export type ExpressResponse<T> = (res: Response, body: ApiResponse<T>) => void;
