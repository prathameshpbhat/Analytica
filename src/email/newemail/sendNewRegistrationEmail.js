const nodeMailer=require('nodemailer')
const { promisify } = require('util');
const fs=require('fs')
let mail='gowithbang@gmail.com';
let pass="gowithbang99*"
var smtpTransport = require('nodemailer-smtp-transport');
const readFile = promisify(fs.readFile);
const SendNewregistrationEmail=async(toMail)=>{


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
        // text:'hello'
        html:html,
        attachments: [
            {
            filename: 'image-1.png',
            path: './src/email/newemail/images/image-1.png',
            cid: 'i1@kreata.ee' //same cid value as in the html img src
        },
        {
            filename: 'image-2.png',
            path: './src/email/newemail/images/image-2.png',
            cid: 'i2@kreata.ee' //same cid value as in the html img src
        },
        {
            filename: 'image-3.png',
            path: './src/email/newemail/images/image-3.png',
            cid: 'i3@kreata.ee' //same cid value as in the html img src
        },
        {
            filename: 'image-4.jpeg',
            path: './src/email/newemail/images/image-4.jpeg',
            cid: 'i4@kreata.ee' //same cid value as in the html img src
        },
        {
            filename: 'image-5.png',
            path: './src/email/newemail/images/image-5.png',
            cid: 'i5@kreata.ee' //same cid value as in the html img src
        },

    ]
    }
   
   await transPorter.sendMail(mailOptions)
}

module.exports=SendNewregistrationEmail;