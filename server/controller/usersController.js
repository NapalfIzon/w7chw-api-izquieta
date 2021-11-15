const chalk = require("chalk");
const debug = require("debug")("socialNetwork:usersController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../database/models/user");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    debug(chalk.bgGreen.red("Se ha hecho un GET en /users/all OK"));
    res.json(users);
  } catch (error) {
    // TODO mirar en que casos el find hara un reject y genera error
    error.code = 400;
    error.message = "Petición errónea";
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  const userData = req.body;

  try {
    const password = await bcrypt.hash(userData.password, 10);
    const image =
      userData.image.length === 0
        ? "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png"
        : userData.image;

    const newUser = await User.create({
      username: userData.username,
      password,
      name: userData.name,
      age: userData.age,
      bio: userData.bio,
      image,
      imageLocal:
        "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
      friend: userData.friend,
      enemies: userData.enemies,
    });
    debug(chalk.bgGreen.red("Se ha hecho un POST en /users/register OK"));
    res.status(201).json(newUser);
  } catch {
    const error = new Error("Fallo al crear usuario: datos incorrectos.");
    error.code = 400;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const userData = await User.findOne({ username });
  if (userData) {
    const checkedPassword = await bcrypt.compare(password, userData.password);
    if (checkedPassword) {
      const token = jwt.sign(
        {
          id: userData.id,
          name: userData.name,
          username: userData.username,
          friends: userData.friends,
          enemies: userData.enemies,
          isAuthenticated: true,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 3600 * 24 * 7,
        }
      );
      res.json({ token });
    } else {
      const error = new Error("Datos erróneos.");
      error.code = 401;
      debug(chalk.bgRed.cyan(`Error generado: ${JSON.stringify(error)}`));
      next(error);
    }
  } else {
    const error = new Error("Datos erróneos.");
    error.code = 401;
    debug(chalk.bgRed.cyan(`Error generado: ${JSON.stringify(error)}`));
    next(error);
  }
};

module.exports = { getUsers, registerUser, loginUser };
