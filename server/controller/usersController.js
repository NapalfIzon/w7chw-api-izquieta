const chalk = require("chalk");
const debug = require("debug")("socialNetwork:usersController");
const User = require("../../database/models/user");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    debug(chalk.bgGreen.red("Se ha hecho un GET en /users/all OK"));
    res.json(users);
  } catch (error) {
    error.code = 400;
    error.message = "Petición errónea";
    next(error);
  }
};

module.exports = { getUsers };
