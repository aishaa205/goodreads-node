const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
// const userRoutes = require("./routes/userRoutes");
const userBookRoutes = require("./routes/userBookRoutes");
const routes = require("./routes");
const app = express();
const path = require("path");
require("dotenv").config();
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

mongoose
  .connect(
    "mongodb+srv://enghusseinsaad1:cCxlORhhU68ziVmn@cluster0.6auvi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {}
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));
app.use("/categories", categoryRoutes);

app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
// app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);

app.use(routes);

// UserBooks routes
app.use("/userBook", userBookRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
