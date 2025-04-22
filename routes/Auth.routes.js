import express from "express";
import {
  login,
  loginUser,
  register,
  registerUser,
} from "../controllers/Auth.contoller.js";
const AuthRoutes = express.Router();

//LOGIN ROUTES HANDLER

AuthRoutes.get("/login", login);
AuthRoutes.post("/login", loginUser);

// REGISTER ROUTES HANDLER
AuthRoutes.get("/register", register);

AuthRoutes.post("/register", registerUser);

export default AuthRoutes;
