const express = require("express");
const auth = require("../middlewares/auth");
const {
  getUsers,
  registerUser,
  loginUser,
} = require("../controller/usersController");

const router = express.Router();

router.get("/all", auth, getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
