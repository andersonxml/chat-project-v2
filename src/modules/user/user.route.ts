import Router from "express";
import { UserController } from "./user.controller.js";
import { authAdminMiddleware, authMiddleware } from "../../shared/middlewares/auth.middleware.js";

export const userRouter = Router();
const userController = new UserController();

userRouter.get("/", authMiddleware, userController.users);
userRouter.put("/", authAdminMiddleware, userController.edit);
userRouter.delete("/:email", authAdminMiddleware, userController.delete);
userRouter.get("/me", authMiddleware, userController.me);