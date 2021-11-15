const express = require("express");
const {
  getUsers,
  registerUser,
  loginUser,
} = require("../controller/usersController");

const router = express.Router();

router.get("/all", getUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
