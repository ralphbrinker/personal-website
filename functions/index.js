const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');

// Load environment variables
require('dotenv').config();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true, // use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.email = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const { name, company, email, phone, message } = request.body;

        transporter.sendMail({
            from: '"Ralph Brinker" <contact@ralphbrinker.com>',
            to: 'contact@ralphbrinker.com',
            subject: 'Contact us',
            html: `Contact from the website:</br></br>
                Name: <em>${ name }</em></br></br>
                Company: <em>${ company }</em></br></br>
                Email: <em>${ email }</em></br></br>
                Phone: <em>${ phone }</em></br></br>
                Message: <em>${ message }`
        }, (error, info) => {
            if (error) {
                console.error(error);
                return response.status(400).end();
            }

            console.info(info);
            return response.status(200).end();
        });
    });
});
