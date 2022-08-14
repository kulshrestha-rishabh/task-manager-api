const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email, name)=>{
    sgMail.send({
        to:email,
        from:'manitrollno16@gmail.com',
        Subject:'Thanks for joining App',
        text:'Welcome to the app '+name+'.Happy to have you on our platform'

    })
}
const deleteAccountEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'manitrollno16@gmail.com',
        Subject:'Sorry to see you go!',
        text:'Happy to serve you '+name+' ,but would like to know your feeback for improvement.'
    })
}
module.exports=
{
    sendWelcomeEmail,
    deleteAccountEmail
}
