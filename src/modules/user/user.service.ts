import { pool } from "../../db";
import type { Iuser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload : Iuser) => {
    const { name, age, email, is_active,password } = payload;

    const hasPassword = await bcrypt.hash(password,10)

    const result = await pool.query(
      `
      INSERT INTO users (name, age, email, password, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, age, email, hasPassword, is_active ?? true],
    );
    delete result.rows[0].password
    return result
};

const getAllUserfromDB = async()=>{
     const result = await pool.query("SELECT * FROM users");
     return result
}

const getSingleUserFromDB = async (id:string) =>{
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result
}

const updateUserFromDB = async (payload : Iuser,id:string) => {

    const {name, age, email, is_active} = payload;
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
    return result
}

const removeUserFromDB = async (id:string) => {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    return result
}

export const userService = {
    createUserIntoDB,
    getAllUserfromDB,
    getSingleUserFromDB,
    updateUserFromDB,
    removeUserFromDB
}