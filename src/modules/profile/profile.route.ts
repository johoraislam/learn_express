import { Router } from "express";
import { profileControler } from "./profile.controler";

const router = Router()

router.post("/",profileControler.createProfile)

export const profileRouter = router;