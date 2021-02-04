const express = require('express')
const flash = require('connect-flash')

const isloggedin = (req,res,next)=>
{
    if(req.isAuthenticated())
    {
        return next()
    }
    req.flash('Error','Your need to login')
    res.redirect('/login')
}

module.exports =isloggedin