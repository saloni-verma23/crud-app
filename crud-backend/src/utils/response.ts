import { Response } from "express";
import { ApiResponse } from "../types";

export const sendResponse = <T>(
  res: Response,
  success: boolean,
  message: string,
  data: T | null = null,
  status = 200
): void => {
  const response: ApiResponse<T> = {
    success,
    message,
    data: (data === null ? {} : data) as T,
  };

  res.status(status).json(response);
};
