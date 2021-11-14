require("dotenv").config();
const { User } = require("../../database/models/user");
const { getUsers, registerUser } = require("./usersController");

jest.mock("../../database/models/user");

describe("Given a getUsers function", () => {
  describe("When it receives a request, a response and next function", () => {
    test("Then it should invoke res.json with the list of the registered users.", async () => {
      const req = {};
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
      const res = {
        json: jest.fn(),
      };
      User.create = jest.fn().mockResolvedValue(testedUser);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith(testedUser);
    });
  });

  describe("When it receives a request with a new user, a response and next function", () => {
    test("The it should invoke res.json with the new user.", async () => {
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
