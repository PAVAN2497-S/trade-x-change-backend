require('dotenv').config()
const nodemailer = require('nodemailer')
const user = process.env.NODE_MAILER_MAIL
const pass = process.env.NODE_MAILER_PASS

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: user,
      pass: pass
   }
})

module.exports = transporter