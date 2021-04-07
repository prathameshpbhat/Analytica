const sgMail = require('@sendgrid/mail');
const mainData=require('../../jsonFileData/json')
const senGridSenMail=()=>{

const senGridSenMail=()=>{
sgMail.setApiKey('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');
const msg = {
    from:mainData.GmailUsername,
        to:toMail,
        subject:'Welcome to Analytica',
        text:'hello'
};
sgMail.send(msg);
}
}
module.exports=senGridSenMail;