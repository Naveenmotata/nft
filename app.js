require("dotenv").config(); // Load environment variables at the very top

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const productRouter = require("./routes/products");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 3000; // Use an environment variable for the port if available

const MONGO_URL = process.env.MONGO_URL;
console.log("MongoDB URL:", MONGO_URL); // Check if MongoDB URL is properly loaded

async function main() {
    if (!MONGO_URL) {
        console.error("MongoDB connection string is undefined.");
        return;
    }
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to database");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

main();

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(ejsLayouts);
app.set("layout", "layouts/boilerplate");

// Configure session store with MongoStore
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET || 'default_secret',
    },
    touchAfter: 24 * 3600, // Limit session updates to once per 24 hours
});
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE");
});

app.use(session({
    store,
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set currUser
app.use((req, res, next) => {
    res.locals.currUser = req.user || null;
    next();
});

// Middleware for flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/signup", userRouter);
app.use("/login", loginRouter);
app.use("/products", productRouter);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Rental System");
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).render("error", { message: "Page not found" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
