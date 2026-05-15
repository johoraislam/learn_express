import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection-e SSL Warning fix kora holo
const pool = new Pool({
  connectionString: config.connectionString,
   
  ssl: {
    rejectUnauthorized: false,
  },
});

const initDB = async () => {
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
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express World",
    status: "success",
    author: "Neela",
  });
});

// Post request optimized
app.post("/api/users", async (req: Request, res: Response) => {
  const { name, age, email, is_active } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO users (name, age, email, password, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, age, email, "password123", is_active ?? true],
    );

    res.status(201).json({
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    // Jodi email agei thake (Duplicate Key Error)
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Email already exists",
        status: "fail",
      });
    }

    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});


//get all users

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});

// get single user

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      data: result.rows[0],
    });
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});

// update user
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, age, email, is_active } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET name = COALESCE($1, name),
       age = COALESCE($2, age),
        email = COALESCE($3, email),
         is_active = COALESCE($4, is_active)
      WHERE id = $5
      RETURNING *
      `,
      [name, age, email, is_active ?? true, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});

// delete user
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
