const sgMail = require('@sendgrid/mail');
const mainData=require('../../jsonFileData/json')

    const SendNewregistrationEmail=async (toMail)=>{
sgMail.setApiKey('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');
console.log(toMail)
const msg = {
    from:mainData.GmailUsername,
        to:toMail,
        subject:'Welcome to Analytica',
        text:'hello'
};
try{
    await sgMail.send(msg);
    console.log('emailsent')
}
catch(e){
    console.log(e)
}


}

module.exports=SendNewregistrationEmail;