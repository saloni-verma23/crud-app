# Form CRUD Application

A simple **CRUD** (Create, Read, Update, Delete) web application for managing users, built using modern full-stack technologies:

- **Frontend**: Vue.js + TypeScript
- **Backend**: Express.js + PostgreSQL
- **Two backend implementations**:
  1. **Raw SQL Queries**
  2. **Prisma ORM**

---

## 📂 Project Structure

```
/crud-frontend            # Vue + TypeScript frontend
/crud-backend             # Express backend with raw SQL queries
/crud-backend-with-orm    # Express backend with Prisma ORM
```

---

## ⚙️ Features

- Add, view, update, and delete user data.
- Two backend approaches for learning:
  - **Raw SQL**: Direct queries to PostgreSQL.
  - **ORM**: Prisma for database interaction.

---

## 🗄 Database Setup

### 1️⃣ Raw SQL Version

1. **Create the database:**
   - Create a PostgreSQL database named `form_db`.

2. **Create the USERS table:**

   ```sql
   CREATE TABLE USERS(
     id SERIAL PRIMARY KEY,
     first_name VARCHAR(30) NOT NULL,
     last_name VARCHAR(30) NOT NULL,
     dob DATE NOT NULL,
     mobile VARCHAR(15) UNIQUE NOT NULL,
     address TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Configure the backend:**
   - Update your `.env` file in `/crud-backend`:

     ```
      PORT=PORT
      DB_USER=DB_USER
      DB_PASSWORD=DB_PASSWORD
      DB_HOST=DB_HOST
      DB_PORT=DB_PORT
      DB_NAME=DB_NAME
     ```

---

### 2️⃣ Prisma ORM Version

1. **Create the database:**
   - Create a PostgreSQL database named `userform_db`.

2. **Configure the backend:**
   - Update your `.env` file in `/crud-backend-with-orm`:

     ```
     DATABASE_URL="postgresql://<username>:<password>@localhost:5432/userform_db?schema=public"
     ```

3. **Run Prisma migration:**

   ```bash
   npx prisma migrate dev --name init
   ```

---

## 🚀 Running the Application

### 1️⃣ Backend (Choose one: Raw SQL or Prisma)

Navigate to your backend folder:

```bash
cd crud-backend
# or
cd crud-backend-with-orm
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

---

### 2️⃣ Frontend

Navigate to the frontend folder:

```bash
cd crud-frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

---

## 📌 Notes

- You can switch between the raw SQL and Prisma ORM backends without changing the frontend.
- Make sure your PostgreSQL service is running before starting the backend.
- The frontend communicates with whichever backend you have running.

---

## 🛠 Tech Stack

- **Frontend**: Vue 3, TypeScript, Axios
- **Backend**: Node.js, Express.js, PostgreSQL
- **ORM**: Prisma (for the ORM version)

---
