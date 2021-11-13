const chalk = require("chalk");
const debug = require("debug")("socialNetwork:indexServer");
const express = require("express");
const morgan = require("morgan");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(
        chalk.bgGreen.red(
          `Servidor ejecutado OK y escuchando el puerto ${port} ${"ᕦ( ͡° ͜ʖ ͡°)ᕤ"}`
        )
      );
      resolve(server);
    });

    server.on("error", (error) => {
      debug(
        chalk.bgRed.black(
          `Ha habido un problema inicializando el servidor ಥ╭╮ಥ`
        )
      );
      if (error.code === "EADDRINUSE") {
        debug(chalk.bgRed.black(`El puerto ${port} está en uso ಥ╭╮ಥ`));
      }
      reject();
    });

    server.on("close", () => {
      debug(
        chalk.bgBlue.yellow(
          `Se ha desconectado el servidor correctamente ( ͡° ͜ʖ ͡°)`
        )
      );
    });
  });

app.use(morgan("dev"));

app.use(express.json());

app.use("/users", usersRoutes);

module.exports = initializeServer;
