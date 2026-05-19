import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // check user exists
  const userData = await pool.query(
    `
      SELECT * FROM users
      WHERE email = $1
    `,
    [email]
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = userData.rows[0];

  // compare password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
   config.secret as string,
    {
      expiresIn: "7d",
    }
  );

  // remove password
  const { password: pass, ...remainingUser } = user;

  return {
    token,
    user: remainingUser,
  };
};

export const authService = {
  loginUserIntoDB,
};