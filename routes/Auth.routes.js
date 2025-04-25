import express from "express";
import {
  login,
  loginUser,
  logout,
  register,
  registerUser,
} from "../controllers/Auth.controller.js";
import upload from "../middlewares/Storage.middleware.js";
const AuthRoutes = express.Router();

//LOGIN ROUTES HANDLER

AuthRoutes.get("/login", login);
AuthRoutes.post("/login", loginUser);

// REGISTER ROUTES HANDLER
AuthRoutes.get("/register", register);

AuthRoutes.post("/register",upload.single("profilePic"), registerUser);
// LOGOUT ROUTES 
AuthRoutes.post("/logout", logout);

export default AuthRoutes;
