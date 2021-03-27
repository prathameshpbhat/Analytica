const express = require("express");
const flash = require("connect-flash");
const users = require("../models/users");
const isloggedin = async (req, res, next) => {
  let response;
  try {
    response = await users.find({
      Email: req.body.user,
      tokens: {
        $elemMatch: {
          token: req.body.token,
        },
      },
    });

    if (response.length != 0) req.token = req.body.token;
    else req.token = undefined;

    if (!req.token) {
      return res.status(401).send({
        error: "user not authorised",
      });
    }
    return next();
  } catch (e) {
    console.log(e);
    return next();
  }
};

module.exports = isloggedin;
