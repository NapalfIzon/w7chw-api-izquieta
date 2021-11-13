const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 16,
    max: 130,
  },
  bio: {
    type: String,
    required: true,
    maxlength: 100,
  },
  image: {
    type: String,
    required: true,
  },
  imageLocal: {
    type: String,
    required: true,
  },
  friend: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
  enemies: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
