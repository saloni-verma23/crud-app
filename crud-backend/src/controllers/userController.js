import * as userService from "../services/userService.js";
import { validateUser } from "../validators/userValidator.js";

const response = ( res, success, message, data = null, status = 200, meta = null) => {
  res.status(status).json({success, message, data, meta});
}

export const getUsers = async (req, res) => {
   try{
    const { query: searchTerm, page = 1, limit = 10, sortBy = "first_name", order = "asc" } = req.query;
    const { users, totalUsers } = await userService.getAllUsers({  query: searchTerm, page, limit, sortBy, order });
    if(users.length > 0) {
      response(res, true, "Users retrieved successfully", {totalUsers, users}, 200);
    } else {
      response(res, true, "No users found", [], 200);
    }
  } catch (err) {
    console.error("Controller error:", err);
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
