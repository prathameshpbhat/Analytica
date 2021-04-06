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
let html;
    try{
     html=   await readFile('./src/email/newemail/index.html', 'utf8')
    }
    catch(e){
        console.log(e)
    }
    const mailOptions={
        from:'gowithbang@gmail.com',
        to:toMail,
        subject:'Welcome to Analytica',
        text:text
    }
   
   await transPorter.sendMail(mailOptions)
}

module.exports=ResetPasswordMail;