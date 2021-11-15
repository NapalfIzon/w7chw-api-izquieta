require("dotenv").config();
const bcrypt = require("bcrypt");
const { User } = require("../../database/models/user");
const { getUsers, registerUser, loginUser } = require("./usersController");

jest.mock("../../database/models/user");
jest.mock("bcrypt");

describe("Given a getUsers function", () => {
  describe("When it receives a request, a response and next function", () => {
    test("Then it should invoke res.json with the list of the registered users.", async () => {
      const testedUsers = [
        {
          _id: "618b8c2aced14353aa06a7ca",
          username: "random",
          password: process.env.PASSWORD_TEST_1,
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
          password: process.env.PASSWORD_TEST_2,
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
          password: process.env.PASSWORD_TEST_3,
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
      const req = {
        body: testedUsers,
      };
      const res = {
        json: jest.fn(),
      };
      User.find = jest.fn().mockResolvedValue({});

      await getUsers(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a empty request, a response and next function", () => {
    test("Then it should invoke a next function with an error.", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const error = {};
      User.find = jest.fn().mockRejectedValue(error);

      await getUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error).toHaveProperty("code");
      expect(error.code).toBe(400);
    });
  });
});

describe("Given a registerUser function", () => {
  describe("When it receives a request with a new user, a response and next function", () => {
    test("The it should invoke res.json with the new user.", async () => {
      const testedUser = {
        username: "random",
        password: process.env.PASSWORD_TEST_1,
        name: "Random user",
        age: 35,
        bio: "Im a random user",
        image:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        imageLocal:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        friend: ["618ffbbcb5c283cc27869737", "618ec7799712904c2b990e81"],
        enemies: ["619029fc4560e84fa4bd629d", "618f8beafddb96a60f98db55"],
        id: "6190f62fa44e9c6a8d2a60cf",
      };
      const req = {
        body: testedUser,
      };
      const res = (() => {
        const testedRes = {};
        testedRes.status = jest.fn().mockReturnValue(testedRes);
        testedRes.json = jest.fn().mockReturnValue(testedRes);

        return testedRes;
      })();
      User.create = jest.fn().mockResolvedValue(testedUser);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith(testedUser);
    });
  });

  describe("When it receives an empty request, a response and next function", () => {
    test("The it should invoke next function with 400 status code.", async () => {
      const req = {};
      const res = {};
      const next = jest.fn();
      User.create = jest.fn().mockRejectedValue({});
      const errorCode = 400;

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("code");
      expect(next.mock.calls[0][0].code).toBe(errorCode);
    });
  });
});

describe("Given a loginUser function,", () => {
  describe("When it receives a request with an existent user and a response,", () => {
    test("Then it should invoke res.json with the generated token.", async () => {
      const testedUser = {
        username: "random",
        password: process.env.PASSWORD_TEST_1,
        name: "Random user",
        age: 35,
        bio: "Im a random user",
        image:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        imageLocal:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        friend: ["618ffbbcb5c283cc27869737", "618ec7799712904c2b990e81"],
        enemies: ["619029fc4560e84fa4bd629d", "618f8beafddb96a60f98db55"],
        id: "6190f62fa44e9c6a8d2a60cf",
      };
      const req = {
        body: testedUser,
      };
      const res = {
        json: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue(testedUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      await loginUser(req, res, null);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with an existent user with a wrong password, a response and a next function,", () => {
    test("Then it should invoke the next function with a 401 error code.", async () => {
      const testedUser = {
        username: "random",
        password: process.env.PASSWORD_TEST_1,
        name: "Random user",
        age: 35,
        bio: "Im a random user",
        image:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        imageLocal:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        friend: ["618ffbbcb5c283cc27869737", "618ec7799712904c2b990e81"],
        enemies: ["619029fc4560e84fa4bd629d", "618f8beafddb96a60f98db55"],
        id: "6190f62fa44e9c6a8d2a60cf",
      };
      const errorCode = 401;
      const req = {
        body: testedUser,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("code");
      expect(next.mock.calls[0][0].code).toBe(errorCode);
    });
  });

  describe("When it receives a request with an non existent user, a response and a next function,", () => {
    test("Then it should invoke the next function with a 401 error code.", async () => {
      const testedUser = {
        username: "random",
        password: process.env.PASSWORD_TEST_1,
        name: "Random user",
        age: 35,
        bio: "Im a random user",
        image:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        imageLocal:
          "https://gitanosdemex.hypotheses.org/files/2018/01/yellow-user-icon.png",
        friend: ["618ffbbcb5c283cc27869737", "618ec7799712904c2b990e81"],
        enemies: ["619029fc4560e84fa4bd629d", "618f8beafddb96a60f98db55"],
        id: "6190f62fa44e9c6a8d2a60cf",
      };
      const errorCode = 401;
      const req = {
        body: testedUser,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(testedUser);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("code");
      expect(next.mock.calls[0][0].code).toBe(errorCode);
    });
  });
});
