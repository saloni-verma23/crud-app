import * as userService from "../services/userService.js";
import { validateUser } from "../validators/userValidator.js";

const response = ( res, success, message, data = null, status = 200, meta = null) => {
  res.status(status).json({success, message, data, meta});
}

export const getUsers = async (req, res) => {
  try {
    const { page=1, limit=10, sortBy="created_at", order="desc" } = req.query;
    const users = await userService.getAllUsers({
      page,
      limit,
      sortBy,
      order
    });
    const totalUsers = await userService.getUserCount();

    response(res, true, "Users retrieved successfully", users, 200, { totalUsers });
  } catch (err) {
    response(res, false, "Server error", null, 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return response(res, false, "User not found", null, 404);
    response(res, true, "User retrieved successfully", user);
  } catch (err) {
    response(res, false, "Server error", null, 500);
  }
};

export const searchUsers = async (req, res) => {
  try{
    const { query, page = 1, limit = 10, sortBy = "first_name", order = "asc" } = req.query;
    const { users, totalUsers } = await userService.searchUsers({ query, page, limit, sortBy, order });
    if(users.length > 0) {
      response(res, true, "Users retrieved successfully", users, 200, {totalUsers});
    } else {
      response(res, false, "No users found", null, 404);
    }
  } catch (err) {
    response(res, false, "Server error", null, 500);
}
};

export const createUser = async (req, res) => {
  try {
    const errors = validateUser(req.body);
    if (errors) return response(res, false, "Validation error", errors, 400);

    const user = await userService.createUser(req.body);
    response(res, true, "User created successfully", user, 201);
  } catch (err) {
     if (err.code === "23505") {
      return response(res, false, "Mobile number already exists", null, 400);
    }
    response(res, false, "Server error", null, 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validateUser(req.body);
    if (errors) return response(res, false, "Validation error", errors, 400);

    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return response(res, false, "User not found", null, 404);

    response(res, true, "User updated successfully", user);
  } catch (err) {
    response(res, false, "Server error", null, 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return response(res, false, "User not found", null, 404);
    response(res, true, "User deleted successfully", null, 200);
  } catch (err) {
    response(res, false, "Server error", null, 500);
  }
};
