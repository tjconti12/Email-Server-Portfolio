const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const creds = require('./config');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/', router);


if(creds.ENVIRONMENT === "development") {
    // Used for testing
    var transport = {
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: creds.TESTUSER,
        pass: creds.TESTPASS
        }
    };
} else {
    // Nodemailer transport object
    const transport = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: creds.USER,
            pass: creds.PASS
        }
    }
}



const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if(error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages')
    }
});


app.get('/', (req, res) => {
    res.send('GET request to the homepage')
});

router.post('/send', (req, res, next) => {
    let name = req.body.name;
    let email = req.body.email
    let message = req.body.message
    let content = `name: ${name} \nemail: ${email} \nmessage: ${message}`

    let mail = {
        from: name,
        to: creds.USER,
        subject: 'New Message from Contact Form',
        text: content
    }

    transporter.sendMail(mail, (err, data) => {
        if(err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })
            // Sending the autoreply
            transporter.sendMail({
                from: creds.USER,
                to: email,
                subject: "Submission was successful",
                text: `Thank you for contacting me ${name}! I will get back to you as soon as possible. \n\nTyler`
            }, function(error, info) {
                if(error) {
                    console.log(error)
                } else {
                    console.log('Message send: ' + info.response);
                }
            });
        }
    })
})



app.listen(PORT);