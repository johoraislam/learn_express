import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/user/user.route";
import { profileControler } from "./modules/profile/profile.controler";
import { profileRouter } from "./modules/profile/profile.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express World",
    status: "success",
    author: "Neela",
  });
});

//user route
app.use("/api/users",userRouter)
//profile route
app.use("/api/profile",profileRouter)




export default app 