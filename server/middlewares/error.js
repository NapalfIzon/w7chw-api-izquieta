const chalk = require("chalk");
const debug = require("debug")("socialNetwork:error");
const { ValidationError } = require("express-validation");

const notFoundHandler = (req, res) => {
  debug(
    chalk.bgRed.cyan("Se ha hecho una petición a un endpoint no definido ಥ╭╮ಥ")
  );
  res.status(404).json({ error: "Endpoint no encontrado." });
};

const finalErrorHandler = (error, req, res) => {
  if (error instanceof ValidationError) {
    debug(chalk.bgRed.cyan("Se ha detectado un error no definido ಥ╭╮ಥ"));
    error.code = 400;
    error.message = "Credenciales erróneas.";
  }
  debug(chalk.bgRed.cyan(`Error: ${error.message}`));
  const message = error.code ? error.message : "Error general.";
  res.status(error.code || 500).json({ error: message });
};

module.exports = { notFoundHandler, finalErrorHandler };
