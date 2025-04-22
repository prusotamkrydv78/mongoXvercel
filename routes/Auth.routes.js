import express from "express";
import UserModel from "../models/User.model.js";
const AuthRoutes = express.Router();

//LOGIN ROUTES HANDLER

AuthRoutes.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "BlogVerse - Login",
    user: null,
  });
});

// REGISTER ROUTES HANDLER
AuthRoutes.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "BlogVerse - Register",
    user: null,
  });
});

AuthRoutes.post("/register", async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201);
    res.json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.json({
      message: "faild to save user",
      error: error.message,
    });
  }
});

export default AuthRoutes;
