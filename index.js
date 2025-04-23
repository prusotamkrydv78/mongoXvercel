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
import PostRoutes from "./routes/Post.routes.js";
import cloudinary from "./configs/claudinary.config.js";
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
app.use("/post",PostRoutes)

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
      posts: dummyPosts.filter(post => post.creator.username === "john_doe"),
      savedPosts: [dummyPosts[1]],
      interests: ["Web Development", "JavaScript", "Node.js", "React", "UI/UX Design"],
      socialLinks: {
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe"
      }
    }
  });
}); 
app.get("/posts", (req, res) => {
  res.render("posts", {
    title: "BlogVerse - My Posts",
    user: req.user,
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
      posts: dummyPosts.filter(post => post.creator.username === "john_doe"),
      activities: [
        { type: 'post', title: 'Created a new post: Getting Started with Node.js', date: new Date(2023, 5, 15), category: 'Technology' },
        { type: 'comment', title: 'Commented on: The Future of Web Development', date: new Date(2023, 5, 14) },
        { type: 'like', title: 'Liked: 10 Tips for Better Productivity', date: new Date(2023, 5, 13) },
        { type: 'post', title: 'Updated post: JavaScript Best Practices', date: new Date(2023, 5, 10), category: 'Technology' }
      ]
    }
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
      emailPreferences: 'important',
      socialLinks: {
        twitter: "https://twitter.com/johndoe",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe"
      }
    }
  });
});

app.get("/bookmarks", (req, res) => {
  res.render("bookmarks-minimal", {
    title: "BlogVerse - Bookmarks",
    user: req.user || {
      username: "john_doe",
      fullName: "John Doe",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      savedPosts: dummyPosts.map(post => ({
        ...post,
        author: post.creator,
        excerpt: post.content.substring(0, 120) + '...',
        coverImage: post.image
      }))
    }
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
