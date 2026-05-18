import { Pool } from "pg";
import config from "../config";

// Connection-e SSL Warning fix
export const pool = new Pool({
  connectionString: config.connectionString,

  ssl: {
    rejectUnauthorized: false,
  },
});

export const initDB = async () => {
  try {
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20) NOT NULL,
        age INTEGER NOT NULL,
        email VARCHAR(25) NOT NULL UNIQUE,
        password VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
      `,
    );

    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,

    bio TEXT,
    phone VARCHAR(20),
    address TEXT,
    gender VARCHAR(10),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  )
      `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
