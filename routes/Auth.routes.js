import express from "express";

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

AuthRoutes.post("/register",(req,res)=>{
    const newUser = req.body;
    console.log(newUser);
})

export default AuthRoutes;
