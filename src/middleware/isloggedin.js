const express = require('express')
const flash = require('connect-flash')
const users = require('../models/users')
const isloggedin = async (req, res, next) => {

    let response;
    try {
        response = await users.find({
            Email: req.body.email,
            tokens: {
                $elemMatch: {
                    token: req.body.token
                }
            }
        })
        if (response.length != 0) {

            console.log(response)
            req.token = req.body.token
            return next();
        } else {

            req.token = undefined;
            return next();
        }

    } catch (e) {
        console.log(e)
        return next();


    }




}

module.exports = isloggedin