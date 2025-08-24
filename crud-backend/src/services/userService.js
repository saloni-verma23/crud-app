import pool from "../config/db.js";

export const getAllUsers = async ({ page, limit, sortBy, order }) => {
  const offset = (page - 1) * limit;

  const sortByVariants = ["first_name", "dob", "created_at"];
  const orderVariants = ["asc", "desc"];

  !sortByVariants.includes(sortBy)
    ? (sortBy = "created_at")
    : (sortBy = sortBy.toLowerCase());

  !orderVariants.includes(order)
    ? (order = "desc")
    : (order = order.toLowerCase());

  const result = await pool.query(
    `SELECT * FROM users ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

export const getUserCount = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM users");
  return parseInt(result.rows[0].count, 10);
};

export const getUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const searchUsers = async ({query, page, limit, sortBy, order}) => {
  const offset = (page - 1) * limit;

  const sortByVariants = ["first_name", "dob", "created_at"];
  const orderVariants = ["asc", "desc"];

  !sortByVariants.includes(sortBy)
    ? (sortBy = "first_name")
    : (sortBy = sortBy.toLowerCase());

  !orderVariants.includes(order)
    ? (order = "asc")
    : (order = order.toLowerCase());

  
  const ResultCount = await pool.query(
    "SELECT Count(*)::int as count FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1",
    [`%${query}%`]
  );

  const users = await pool.query(
    `SELECT * FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY ${sortBy} ${order} LIMIT $2 OFFSET $3`,
    [`%${query}%`, limit, offset]
  );

  return { users: users.rows, totalUsers: ResultCount.rows[0].count };
};

export const createUser = async ({
  first_name,
  last_name,
  dob,
  mobile,
  address,
}) => {
  const result = await pool.query(
    "INSERT INTO users (first_name, last_name, dob, mobile, address) VALUES ($1, $2, $3, $4, $5) returning *",
    [first_name, last_name, dob, mobile, address]
  );
  return result.rows[0];
};

export const updateUser = async (
  id,
  { first_name, last_name, dob, mobile, address }
) => {
  const result = await pool.query(
    "UPDATE users SET first_name=$1, last_name=$2, dob=$3, mobile=$4, address=$5 WHERE id=$6 RETURNING *",
    [first_name, last_name, dob, mobile, address, id]
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
};
