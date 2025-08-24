import pool from "../config/db.js";

export const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUser = async ({ first_name, last_name, dob, mobile, address }) => {
  const result = await pool.query(
    "INSERT INTO users (first_name, last_name, dob, mobile, address) VALUES ($1, $2, $3, $4, $5) returning *",
    [first_name, last_name, dob, mobile, address]
  );
  return result.rows[0];
};

export const updateUser = async (id, { first_name, last_name, dob, mobile, address }) => {
  const result = await pool.query(
    "UPDATE users SET first_name=$1, last_name=$2, dob=$3, mobile=$4, address=$5 WHERE id=$6 RETURNING *",
    [first_name, last_name, dob, mobile, address, id]
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
};
