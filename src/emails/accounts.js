const sgMail = require('@sendgrid/mail')

//Need to comment out harcoded api key. And load it via env variable
// const api = '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'

sgMail.setApiKey(process.env.APIKEY)

// sgMail.send({
//     to: 'reallysaif@gmail.com',
//     from: 'reallysaif@gmail.com',
//     subject: 'This is my first creation!',
//     text: 'I hope this one actually get to you.'
// })

const sendWelcomeEmails = (email, name) => {
    sgMail.send({
        to: email,
        from: 'reallysaif@gmail.com',
        subject: 'Thanks for joining',
        text: `Welcome to the app: ${name}`,
        //You can also include html as a key and write custom html for thhe email
        //html : "your html"
    })
}

const sendCancelEmails = (email, name) => {
    sgMail.send({
        to: email,
        from: 'reallysaif@gmail.com',
        subject: 'Regret You are going',
        text: `Thanks for choosing the app: ${name}`,
        //You can also include html as a key and write custom html for thhe email
        //html : "your html"
    })
}

module.exports = {
    sendWelcomeEmails,
    sendCancelEmails
}









