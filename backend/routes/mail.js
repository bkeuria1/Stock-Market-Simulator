const express = require('express');
const passport = require('passport');
//const xoauth2 = require('xoauth2');
const router = express.Router()
const nodemailer = require('nodemailer')
require('dotenv').config()
require('../passport.js')
const ensureAuth = require('../middleware/ensureAuth.js');

router.post('/sale', (req, res) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        //secure: true, // true for 465, false for other ports
        auth: {
            user: 'stockmarketsimulatorapp@gmail.com', // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
      });

    console.log(req.body)
    //const {to, subject, text } = req.body;
    const mailData = {
        from: 'stockmarketsimulatorapp@gmail.com',
        to: req.user.email,
        subject: "Purchase Alert",
        text: req.body.message,

    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(400).send()
        }
        res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
});
module.exports = router