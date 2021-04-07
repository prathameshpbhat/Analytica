const nodeMailer=require('nodemailer')
const { promisify } = require('util');
const fs=require('fs')
const mainData=require('../../jsonFileData/json')
let mail=mainData.GmailUsername;


const sgMail = require('@sendgrid/mail');
const ResetPasswordMail=async(toMail,text)=>{
    sgMail.setApiKey('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');

  

    const mailOptions={
        from:mail,
        to:toMail,
        subject:'Reset Password',
        text:'Please Change passord by Clicking link below,If not requested by you than ignore the message\n'+text
    }
   
    try{
        await sgMail.send(mailOptions);
        console.log('emailsent')
    }
    catch(e){
        console.log(e)
    }
}

module.exports=ResetPasswordMail;