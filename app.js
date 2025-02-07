require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
// const userRoutes = require("./routes/userRoutes");
const userBookRoutes = require("./routes/userBookRoutes");
const userCategoryRoutes = require("./routes/userCategoryRoutes");
const siteContentRoutes = require("./routes/siteContentRoutes");
const routes = require("./routes");
const app = express();
const path = require("path");

//const passport = require("passport");
//require("./config/passport");
const authRoutes = require("./routes/auth");

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
const { createAdminUser } = require("./scripts/setup");
const db_link = process.env.MONGO_CONNECTION_STRING;
mongoose
  .connect(db_link)
  .then(() => {
    console.log("Connected to MongoDB");
    createAdminUser();
  })
  .catch((error) => console.error("Could not connect to MongoDB", error));
// Middleware to serve static files from the "views/images" folder
app.use(express.static(path.join(__dirname, "views")));
app.use(cors());
app.use(express.json());

app.use("/categories", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/usercategories", userCategoryRoutes);
app.use("/siteContent", siteContentRoutes);
// app.use("/users", userRoutes);
//app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use(routes);

// UserBooks routes
app.use("/userBook", userBookRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
