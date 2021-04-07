const nodeMailer=require('nodemailer')
const { promisify } = require('util');
const fs=require('fs')
const mainData=require('../../jsonFileData/json')
const readFile = promisify(fs.readFile);
const sgMail = require('@sendgrid/mail');
const imageToBase64 = require('image-to-base64');

    const SendNewregistrationEmail=async (toMail)=>{
sgMail.setApiKey('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');
console.log(toMail)
let html;
let img1_64 
let img2_64 
let img3_64 
let img4_64 
let img5_64 

try{
 html=   await readFile('./src/email/newemail/index.html', 'utf8')
 img1_64 = await imageToBase64( './src/email/newemail/images/image-1.png')
 img2_64 = await imageToBase64( './src/email/newemail/images/image-2.png')
 img3_64 = await imageToBase64( './src/email/newemail/images/image-3.png')
 img4_64 = await imageToBase64( './src/email/newemail/images/image-4.jpeg')
 img5_64 = await imageToBase64( './src/email/newemail/images/image-5.png')




}
catch(e){
    console.log(e)
}

const mailOptions={
    from:mainData.GmailUsername,
    to:toMail,
    subject:'Welcome to Analytica',
 
    html:html,
    attachments: [
        {
            filename: 'image-1.png',
            type: 'image/png',
            content_id: 'i1@kreata.ee',
            content: img1_64,
            disposition: 'inline',
 
    },
    {
        filename: 'image-2.png',
        type: 'image/png',
        content_id: 'i2@kreata.ee',
        content: img2_64,
        disposition: 'inline',
    },
    {
        filename: 'image-3.png',
        type: 'image/png',
        content_id: 'i3@kreata.ee',
        content: img3_64,
        disposition: 'inline',
    },
    {
        filename: 'image-4.jpeg',
        type: 'image/jpeg',
        content_id: 'i4@kreata.ee',
        content: img4_64,
        disposition: 'inline',
    },
    {
        filename: 'image-5.png',
        type: 'image/png',
        content_id: 'i5@kreata.ee',
        content: img5_64,
        disposition: 'inline',
        

    },

]
}
try{
    await sgMail.send(mailOptions);
    console.log('emailsent')
}
catch(e){
    console.log(e)
}


}

module.exports=SendNewregistrationEmail;
