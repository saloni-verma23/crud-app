import bcrypt from "bcrypt";
import pool from "../config/db";

async function createAdmin(): Promise<void> {
  try {
    const email = process.env.ADMIN_EMAIL as string | undefined;
    const password = process.env.ADMIN_PASSWORD as string | undefined;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
    }

    const existing = await pool.query<{ id: number }>(
      "SELECT id FROM admins WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      console.log("Admin already exists, skipping seeding.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO admins (email, password_hash) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    console.log(`Admin user "${email}" created successfully!`);
  } catch (err: any) {
    console.error("Error creating admin:", err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
