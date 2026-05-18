import type { Request, Response } from "express";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
//   const { name, age, email, is_active } = req.body;

  const result = await userService.createUserIntoDB(req.body)

  try {
    
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
};

const getAllUser =  async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserfromDB();
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
}

const getSingleUser =  async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const result = await userService.getSingleUserFromDB(id)
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
}

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, age, email, is_active } = req.body;

  try {
    const result = await userService.updateUserFromDB(req.body,id as string)

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
}

const removeUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userService.removeUserFromDB(id as string)
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
}


export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    removeUser

}