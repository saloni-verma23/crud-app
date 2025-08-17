import * as userService from "../services/userService.js";
import { validateUser } from "../validators/userValidator.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const createUser = async (req, res) => {
  try {
    const errors = validateUser(req.body);
    if (errors) return res.status(400).json({ errors });

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validateUser(req.body);
    if (errors) return res.status(400).json({ errors });

    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
