const express = require("express");
const cors = require("cors");
require("dotenv").config();

const itemRoutes = require("./routes/item.route");
const { errorHandler } = require("./middlewares/error.handler");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/items", itemRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log("Server running at http://localhost:" + process.env.PORT)
);
