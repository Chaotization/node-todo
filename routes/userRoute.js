import { Router } from "express";
import  userController  from "../controllers/userController.js";

const router = Router();

router
    .route("/register")
    .post(userController.createUser);

router
    .route("/:id")
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

export default router;  