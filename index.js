import express from "express";
import mongoose from "mongoose";
import AuthRoutes from "./routes/Auth.routes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import passportConfig from "./configs/passport.config.js";
import session from "express-session";
import mongoStore from "connect-mongo";
import PostRoutes from "./routes/Post.routes.js";
import cloudinary from "./configs/claudinary.config.js";
import PublicRouter from "./routes/Public.routes.js";
import CommentsRoutes from "./routes/Comments.routes.js";
dotenv.config();

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// session middlewares

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
  })
);
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

// Routes

app.use("/", PublicRouter);
app.use("/auth", AuthRoutes);
app.use("/post", PostRoutes);
app.use("/post", CommentsRoutes);

app.get("/profile", (req, res) => {
  res.render("profile-minimal", {
    title: "BlogVerse - Profile",
    user: req.user || {
      username: "john_doe",
      fullName: "John Doe",
      email: "john@example.com",
      bio: "Web developer and tech enthusiast passionate about creating user-friendly applications. I love working with JavaScript, Node.js, and modern web frameworks.",
      location: "San Francisco, CA",
      website: "https://johndoe.dev",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      createdAt: new Date(2022, 3, 15),
      postsCount: 12,
      followersCount: 248,
      followingCount: 186,
      posts: dummyPosts.filter((post) => post.creator.username === "john_doe"),
      savedPosts: [dummyPosts[1]],
      interests: [
        "Web Development",
        "JavaScript",
        "Node.js",
        "React",
        "UI/UX Design",
      ],
      socialLinks: {
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      },
    },
  });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard-minimal", {
    title: "BlogVerse - Dashboard",
    user: req.user || {
      username: "john_doe",
      fullName: "John Doe",
      email: "john@example.com",
      bio: "Web developer and tech enthusiast passionate about creating user-friendly applications.",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      createdAt: new Date(2022, 3, 15),
      postsCount: 12,
      totalViews: 1240,
      totalComments: 85,
      totalLikes: 320,
      posts: dummyPosts.filter((post) => post.creator.username === "john_doe"),
      activities: [
        {
          type: "post",
          title: "Created a new post: Getting Started with Node.js",
          date: new Date(2023, 5, 15),
          category: "Technology",
        },
        {
          type: "comment",
          title: "Commented on: The Future of Web Development",
          date: new Date(2023, 5, 14),
        },
        {
          type: "like",
          title: "Liked: 10 Tips for Better Productivity",
          date: new Date(2023, 5, 13),
        },
        {
          type: "post",
          title: "Updated post: JavaScript Best Practices",
          date: new Date(2023, 5, 10),
          category: "Technology",
        },
      ],
    },
  });
});

app.get("/settings", (req, res) => {
  res.render("settings-minimal", {
    title: "BlogVerse - Settings",
    user: req.user || {
      username: "john_doe",
      fullName: "John Doe",
      email: "john@example.com",
      bio: "Web developer and tech enthusiast passionate about creating user-friendly applications.",
      location: "San Francisco, CA",
      website: "https://johndoe.dev",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      createdAt: new Date(2022, 3, 15),
      emailPreferences: "important",
      socialLinks: {
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      },
    },
  });
});

app.get("/bookmarks", (req, res) => {
  res.render("bookmarks-minimal", {
    title: "BlogVerse - Bookmarks",
    user: req.user || {
      username: "john_doe",
      fullName: "John Doe",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      savedPosts: dummyPosts.map((post) => ({
        ...post,
        author: post.creator,
        excerpt: post.content.substring(0, 120) + "...",
        coverImage: post.image,
      })),
    },
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
