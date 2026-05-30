const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();


const noteRoutes = require("./routes/api/notes");
const userRoutes = require("./routes/api/users")
const app = express();

// ===============================
// Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Routes
// ===============================

app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

// ===============================
// Default Route
// ===============================
app.get("/", (req, res) => {
  res.json({ message: "Server is running..." });
});

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // ===============================
    // Start Server
    // ===============================
    const PORT = process.env.PORT ;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });