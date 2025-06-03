import { Router } from "express";
import  authRouter  from "../controllers/authController.js";


const router = Router();

router.route("/login").post(authRouter.login);
router.route("/logout").get(authRouter.logout);

export default router;