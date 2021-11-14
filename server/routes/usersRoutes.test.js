require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")("socialNetwork:usersRoutesTest");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const { app, initializeServer } = require("..");
const initializeMongoDb = require("../../database");
const { User } = require("../../database/models/user");

const request = supertest(app);
const testedUsers = [
  {
    _id: "618b8c2aced14353aa06a7ca",
    username: "random",
    password: "random",
    name: "Random user",
    age: 35,
    bio: "Im a random user",
    image:
      "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
    imageLocal:
      "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
    friend: ["618ffbbcb5c283cc27869737", "618ec7799712904c2b990e81"],
    enemies: ["619029fc4560e84fa4bd629d", "618f8beafddb96a60f98db55"],
  },
  {
    _id: "618b8c2aced14353aa06a7cb",
    username: "random2",
    password: "random2",
    name: "Random2 user",
    age: 35,
    bio: "Im a random2 user",
    image:
      "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
    imageLocal:
      "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
    friend: ["618ffbbcb5c283cc27869737", "618ec7799712904c2b990e81"],
    enemies: ["619029fc4560e84fa4bd629d", "618f8beafddb96a60f98db55"],
  },
  {
    _id: "618b8c2aced14353aa06a7cc",
    username: "random3",
    password: "random3",
    name: "Random3 user",
    age: 35,
    bio: "Im a random3 user",
    image:
      "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
    imageLocal:
      "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
    friend: ["618ffbbcb5c283cc27869737", "618ec7799712904c2b990e81"],
    enemies: ["619029fc4560e84fa4bd629d", "618f8beafddb96a60f98db55"],
  },
];
let server;

beforeAll(async () => {
  await initializeMongoDb(process.env.MONGODB_STRING_TEST);
  await User.deleteMany({});
  server = await initializeServer(process.env.TEST_PORT);
  // TODO pendiente implementar login y autenticación para generar el token de uso
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

beforeEach(async () => {
  debug(chalk.bgYellow.cyan("Comienza el test"));
  await User.create(testedUsers[0]);
  await User.create(testedUsers[1]);
  await User.create(testedUsers[2]);
});

afterEach(async () => {
  debug(chalk.bgCyan.yellow("Finaliza el test"));
  await User.deleteMany({});
});

describe("Given a '/all' endpoint,", () => {
  describe("When it gets a GET request,", () => {
    test("Then it should response with an array of users and a 200 status", async () => {
      const { body } = await request.get("/users/all").expect(200);

      const testUsersWithId = testedUsers.map((testedUser) => {
        const testUserWithId = {
          ...testedUser,
          // eslint-disable-next-line no-underscore-dangle
          id: testedUser._id,
        };
        // eslint-disable-next-line no-underscore-dangle
        delete testUserWithId._id;

        return testUserWithId;
      });

      expect(body).toHaveLength(testUsersWithId.length);
      expect(body).toContainEqual(testUsersWithId[1]);
    });
  });
});

describe("Given a '/register' endpoint,", () => {
  describe("When it gets a POST request,", () => {
    test("Then it should response with the new user and a 201 status", async () => {
      const testUserWithId = {
        ...testedUsers[0],
        password: bcrypt.hash(testedUsers[0].password, 10),
        // eslint-disable-next-line no-underscore-dangle
        id: testedUsers._id,
      };
      // eslint-disable-next-line no-underscore-dangle
      delete testUserWithId._id;

      const { body } = await request
        .post("/users/register")
        .send(testUserWithId)
        .expect(201);

      expect(body).toContainEqual(testUserWithId);
    });
  });
});
