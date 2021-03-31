const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid Email");
        }
      },
    },
    Password: {
      type: String,
      required: true,
      trim: true,
    },
    twitter: {
      user_details: {},
      searches: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "twitter_search",
        },
      ],
      user_tweets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_tweets",
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthTokens = async function () {
  const user = this;
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWTTOKEN);
  return token;
};

userSchema.statics.FindUserByCredential = async (Email, Password) => {
  const user = await User.findOne({ Email });

  if (!user) {
    throw new Error("Invalid Username or Password");
  }
  const ismatch = await bcrypt.compare(Password, user.Password);
  if (!ismatch) {
    throw new Error("Invalid Username or Password");
  }
  return user;
};

//
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("Password")) {
    try {
      user.Password = await bcrypt.hash(user.Password, 8);
    } catch (e) {
      console.log(e);
    }
  }
  next();
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
