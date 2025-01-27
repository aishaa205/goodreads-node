const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const app = express();

require("dotenv").config();
require("./models/user");
require("./models/admin");

app.use(cors());
app.use(express.json());
app.use(routes);

const port = process.env.port;
const db_link = process.env.MONGO_CONNECTION_STRING;

mongoose
  .connect(db_link)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
