import { Router} from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post("/login", authController.loginUser );
// router.get("/", userController.getAllUser);
// router.get("/:id",userController.getSingleUser);
// router.put("/:id", userController.updateUser );
// router.delete("/:id", userController.removeUser);


export const authRouter = router