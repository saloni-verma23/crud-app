import pool from "../config/db.js";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  dob: Date;
  mobile: string;
  address: string;
  created_at: Date;
}
interface GetAllUsersParams {
  query?: string | undefined;
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  order?: "asc" | "desc" | string;
}

export const getAllUsers = async ({
  query,
  page,
  limit,
  sortBy,
  order,
}: GetAllUsersParams): Promise<{ users: User[]; totalUsers: number }> => {
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const offset = (pageNum - 1) * limitNum;
  const search = query ? `%${query}%` : "%%";

  const sortByVariants = ["first_name", "dob", "created_at"];
  const orderVariants = ["asc", "desc"];

  sortBy = sortByVariants.includes(sortBy || "")
    ? sortBy!.toLowerCase()
    : "first_name";
  order = orderVariants.includes(order || "") ? order!.toLowerCase() : "asc";

  try {
    const ResultCount = await pool.query<{ count: number }>(
      "SELECT Count(*)::int as count FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1",
      [search]
    );

    const users = await pool.query<User>(
      `SELECT * FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY ${sortBy} ${order} LIMIT $2 OFFSET $3`,
      [search, limitNum, offset]
    );

    return {
      users: users.rows,
      totalUsers: ResultCount.rows[0]?.count ?? 0,
    };
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Database query failed");
  }
};

export const getUserById = async (
  id: string | number
): Promise<User | null> => {
  const result = await pool.query<User>("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
};

export const createUser = async ({
  first_name,
  last_name,
  dob,
  mobile,
  address,
}: Omit<User, "id" | "created_at">): Promise<User> => {
  const result = await pool.query<User>(
    "INSERT INTO users (first_name, last_name, dob, mobile, address) VALUES ($1, $2, $3, $4, $5) returning *",
    [first_name, last_name, dob, mobile, address]
  );
  return result.rows[0]!;
};

export const updateUser = async (
  id: string | number,
  {
    first_name,
    last_name,
    dob,
    mobile,
    address,
  }: Omit<User, "id" | "created_at">
): Promise<User | null> => {
  const result = await pool.query<User>(
    "UPDATE users SET first_name=$1, last_name=$2, dob=$3, mobile=$4, address=$5 WHERE id=$6 RETURNING *",
    [first_name, last_name, dob, mobile, address, id]
  );
  return result.rows[0] || null;
};

export const deleteUser = async (id: string | number): Promise<User | null> => {
  const result = await pool.query<User>(
    "DELETE FROM users WHERE id=$1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
};
