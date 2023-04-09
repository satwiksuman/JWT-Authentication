import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

//Route Level Middleware - To Protect Route
router.use("/changepassword", checkUserAuth);
router.use("/loggeduser", checkUserAuth);

//Public Route
//These are those Routes that cam be accessed without login
//For example to login Register
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post(
  "/send-reset-password-email",
  UserController.sendUserPasswordResetEmail
);
router.post("/reset-password/:id/:token", UserController.userPasswordReset);

//Protected Route
//These are the Routes that can be accessed only on login
//To go to Dashboard or to change password
router.post("/changepassword", UserController.changeUserPassword);
router.get("/loggeduser", UserController.loggedUser);
export default router;
