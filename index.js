import express from "express";
import mongoose from "mongoose";
import AuthRoutes from "./routes/Auth.routes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import passportConfig from "./configs/passport.config.js";
import session from 'express-session'
import mongoStore from 'connect-mongo'
dotenv.config();


// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


// session middlewares 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  })
}))
// passport configuration/

passportConfig();
app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// app.use(express.static())

// Set EJS as the view engine 
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Dummy data for frontend
const dummyUsers = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    bio: "Web developer and blogger",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    bio: "Tech enthusiast and writer",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

const dummyPosts = [
  {
    id: "1",
    title: "Getting Started with Node.js",
    content:
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    creator: dummyUsers[0],
    createdAt: new Date(2023, 5, 15),
    comments: [
      { id: "1", content: "Great article!", author: dummyUsers[1] },
      { id: "2", content: "Thanks for sharing!", author: dummyUsers[0] },
    ],
  },
  {
    id: "2",
    title: "Express.js Fundamentals",
    content:
      "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    creator: dummyUsers[1],
    createdAt: new Date(2023, 6, 20),
    comments: [
      { id: "3", content: "This helped me a lot!", author: dummyUsers[0] },
    ],
  },
  {
    id: "3",
    title: "MongoDB for Beginners",
    content:
      "MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.",
    image: "https://images.unsplash.com/photo-1569012871812-f38ee64cd54c",
    creator: dummyUsers[0],
    createdAt: new Date(2023, 7, 5),
    comments: [],
  },
];
// Routes

app.get("/", (req, res) => {
  res.render("home", {
    title: "BlogVerse - Home",
    posts: dummyPosts,
    user: req.user,
  });
});
app.use("/auth", AuthRoutes);

app.get("/explore", (req, res) => {
  res.render("explore", {
    title: "BlogVerse - Explore",
    posts: dummyPosts,
    user: req.user,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "BlogVerse - About Us",
    user: req.user,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "BlogVerse - Contact Us",
    user: req.user,
  });
});

app.get("/categories", (req, res) => {
  res.render("categories", {
    title: "BlogVerse - Categories",
    user: req.user,
  });
});

app.get("/posts/:id", (req, res) => {
  const post = dummyPosts.find((post) => post.id === req.params.id);
  if (!post) {
    return res.status(404).render("404", {
      title: "BlogVerse - Not Found",
      user: req.user,
    });
  }
  res.render("post", {
    title: `BlogVerse - ${post.title}`,
    post,
    user: req.user,
  });
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "BlogVerse - Page Not Found",
    user: req.user,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
