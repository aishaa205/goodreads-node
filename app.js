const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.use(routes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
