import { Router } from "express";
import { UserController } from "./controllers/userController";
export const router = Router();
router.post("/user", new UserController().create);
router.post("/login", new UserController().login);

router.get("/profile", new UserController().getProfile);
