const express = require("express");
const { getUsers } = require("../controller/usersController");

const router = express.Router();

router.get("/all", getUsers);

module.exports = router;
