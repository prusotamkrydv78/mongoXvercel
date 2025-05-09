import UserModel from "../models/User.model.js";
import bycrypt from "bcrypt";
import { comparePassword, hashPassword } from "../utils/Auth.utils.js";
import passport from "passport";
const saltRounds = 10;

///LOGIN CONTOLLERS

export const login = (req, res) => {
  res.render("auth/login", {
    title: "BlogVerse - Login",
    user: null,
  });
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).redirect("/");
    });
  })(req, res, next);

  //   try {
  //     const user = await UserModel.findOne({ username });
  //     //checking the user is exsit or not
  //     if (!user) {
  //       return res
  //         .status(401)
  //         .json({ message: "Invalid credentials, username not found" });
  //     }

  //     const isPasswordMatch = await comparePassword(password, user.password);
  //     // comfirming the password
  //     if (!isPasswordMatch) {
  //       return res
  //         .status(401)
  //         .json({ message: "Invalid credentials, password is incorrect" });
  //     }
  //     res.status(200).json({ message: "Login successful" });
  //   } catch (error) {
  //     res.status(500).json({ message: "Internal server error" });
  //   }
};

//REGISTER CONTOLLERS

export const register = (req, res) => {
  res.render("auth/register", {
    title: "BlogVerse - Register",
    user: null,
  });
};

export const registerUser = async (req, res) => {
  const { username, email } = req.body; 
  const profilePic = req.file.path;
  req.body.profilePic = profilePic;
  const user = await UserModel.findOne({ username, email });
  try {
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    req.body.password = await hashPassword(req.body.password);
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201);
    res.json({
      message: "user saved successfully",
      user: newUser,
    });
  } catch (error) {
    res.json({
      message: "faild to save user",
      error: error.message,
    });
  }
};

// LOGOUT CONTROLLERS

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
