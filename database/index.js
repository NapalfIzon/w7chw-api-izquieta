const mongoose = require("mongoose");
const chalk = require("chalk");
const debug = require("debug")("socialNetwork:indexMongoServer");

const initializeMongoDb = (endpoint) =>
  new Promise((resolve, reject) => {
    mongoose.connect(endpoint, (error) => {
      if (error) {
        debug(chalk.red("No se ha conectado a BD - ಥ╭╮ಥ"));
        debug(chalk.red(`Error: ${error.message}`));
        reject(error);
      }
      debug(chalk.bgGreen.red("Conectado a mongoDB - ᕦ( ͡° ͜ʖ ͡°)ᕤ"));
      resolve();
    });

    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
      },
    });
  });

module.exports = initializeMongoDb;
