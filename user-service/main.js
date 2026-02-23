const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config")

const {getAllUsers,createUser} = require("./User.controller")

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb/testing";

app.use(express.json());



mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/",getAllUsers)
app.post("/",createUser)
app.listen(PORT,()=>{console.log("user-service is up")})
