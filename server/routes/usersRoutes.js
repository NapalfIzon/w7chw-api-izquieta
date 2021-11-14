const express = require("express");
const { getUsers, registerUser } = require("../controller/usersController");

const router = express.Router();

router.get("/all", getUsers);

router.post("/register", registerUser);

module.exports = router;
