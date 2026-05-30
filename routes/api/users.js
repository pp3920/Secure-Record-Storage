const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

// ======================================================
// REGISTER USER
// POST /api/users/register
// ======================================================

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // create token
    const token = jwt.sign(
      {
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================================================
// LOGIN USER
// POST /api/users/login
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
     console.log(user);
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // create token
    const token = jwt.sign(
      {
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;