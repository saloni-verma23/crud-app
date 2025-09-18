import type { Request, Response } from "express";
import * as userService from "../services/userService";
import { validateUser } from "../validators/userValidator";
import { UserQueryParams } from "../types";

const response = <T>(
  res: Response,
  success: boolean,
  message: string,
  data: T | null = null,
  status = 200,
  meta: unknown = null
): void => {
  res.status(status).json({ success, message, data, meta });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query: searchTerm,
      page = "1",
      limit = "10",
      sortBy = "first_name",
      order = "asc",
    } = req.query as UserQueryParams;

    const { users, totalUsers } = await userService.getAllUsers({
      query: searchTerm,
      page: Number(page),
      limit: Number(limit),
      sortBy,
      order,
    });

    if (users.length > 0) {
      response(res, true, "Users retrieved successfully", {
        totalUsers,
        users,
      });
    } else {
      response(res, true, "No users found", [], 200);
    }
  } catch (err) {
    console.error("Controller error:", err);
    response(res, false, "Server error", null, 500);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      return response(res, false, "Invalid ID", null, 400);
    }
    const user = await userService.getUserById(req.params.id);
    if (!user) return response(res, false, "User not found", null, 404);
    response(res, true, "User retrieved successfully", user);
  } catch (err) {
    response(res, false, "Server error", null, 500);
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validateUser(req.body);
    if (errors) return response(res, false, "Validation error", errors, 400);

    const user = await userService.createUser(req.body);
    if (!user) return response(res, false, "User creation failed", null, 500);
    response(res, true, "User created successfully", user, 201);
  } catch (err: any) {
    if (err.code === "23505") {
      return response(res, false, "Mobile number already exists", null, 400);
    }
    response(res, false, "Server error", null, 500);
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      return response(res, false, "Invalid ID", null, 400);
    }

    const errors = validateUser(req.body);
    if (errors) return response(res, false, "Validation error", errors, 400);

    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return response(res, false, "User not found", null, 404);

    response(res, true, "User updated successfully", user);
  } catch (err) {
    response(res, false, "Server error", null, 500);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params.id) {
      return response(res, false, "Invalid ID", null, 400);
    }

    const user = await userService.deleteUser(req.params.id);
    if (!user) return response(res, false, "User not found", null, 404);
    response(res, true, "User deleted successfully", null, 200);
  } catch (err) {
    response(res, false, "Server error", null, 500);
  }
};
