const chalk = require("chalk");
const debug = require("debug")("socialNetwork:auth");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
      } catch {
        const error = new Error("Autorización denegada.");
        error.code = 401;
        debug(
          chalk.bgRed.cyan(
            "Se ha realizado una solicitud de autenticación con un token incorrecto ಥ╭╮ಥ"
          )
        );
        next(error);
      }
    } else {
      const error = new Error("Autorización denegada.");
      error.code = 401;
      debug(
        chalk.bgRed.cyan(
          "Se ha realizado una solicitud de autenticación con un Bearer sin token ಥ╭╮ಥ"
        )
      );
      next(error);
    }
  } else {
    const error = new Error("Autorización denegada.");
    error.code = 401;
    debug(
      chalk.bgRed.cyan(
        "Se ha realizado una solicitud de autenticación sin token ಥ╭╮ಥ"
      )
    );
    next(error);
  }
};

module.exports = auth;
