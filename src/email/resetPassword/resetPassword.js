const nodeMailer=require('nodemailer')
const { promisify } = require('util');
const fs=require('fs')
let mail='gowithbang@gmail.com';
let pass="gowithbang99*"
var smtpTransport = require('nodemailer-smtp-transport');
const readFile = promisify(fs.readFile);
const ResetPasswordMail=async(toMail,text)=>{


    const transPorter=nodeMailer.createTransport(smtpTransport({
        type: 'OAuth2',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth:{
            user:mail,
            pass:pass
        }
    }))

    const mailOptions={
        from:mail,
        to:toMail,
        subject:'Reset Password',
        text:'Please Change passord by Clicking link below,If not requested by you than ignore the message\n'+text
    }
   
   await transPorter.sendMail(mailOptions)
}

module.exports=ResetPasswordMail;