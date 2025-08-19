import { PrismaClient } from "@prisma/client";
import { validateUser } from '../validators/userValidator.js';

const prisma = new PrismaClient();

const response = (res, success, message, data = null, status = 200) => {
  res.status(status).json({ success, message, data });
};

export const createUser = async (req, res) => {
  try {
    const errors = validateUser(req.body);
    if (errors) {
      return response(res, false, "Validation failed", errors, 400);
    }

    const user = await prisma.users.create({ data: req.body });
    return response(res, true, "User created successfully", user, 201);
  } catch (error) {
    return response(res, false, "Error creating user", error.message, 500);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    return response(res, true, "Users fetched successfully", users);
  } catch (error) {
    return response(res, false, "Error fetching users", error.message, 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return response(res, false, "User not found", null, 404);
    }

    return response(res, true, "User fetched successfully", user);
  } catch (error) {
    return response(res, false, "Error fetching user", error.message, 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validateUser(req.body);
    if (errors) {
      return response(res, false, "Validation failed", errors, 400);
    }

    const user = await prisma.users.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });

    return response(res, true, "User updated successfully", user);
  } catch (error) {
    return response(res, false, "Error updating user", error.message, 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await prisma.users.delete({ where: { id: parseInt(req.params.id) } });
    return response(res, true, "User deleted successfully");
  } catch (error) {
    return response(res, false, "Error deleting user", error.message, 500);
  }
};
