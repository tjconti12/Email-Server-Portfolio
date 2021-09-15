const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const creds = require('./config');

const transport = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: creds.USER,
        pass: creds.PASS
    }
}

// Used for testing
////////////////////////////////////////

// var transport = {
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: creds.TESTUSER,
//       pass: creds.TESTPASS
//     }
//   };

////////////////////////////////////////

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if(error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages')
    }
});

router.post('/send', (req, res, next) => {
    let name = req.body.name;
    let email = req.body.email
    let message = req.body.message
    let content = `name: ${name} \n email: ${email} \n message: ${message}`

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

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(3002);