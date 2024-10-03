// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',  // or another email service like Mailgun, SendGrid, etc.
    auth: {
      user: "vishalsavaliya2912@gmail.com",  // Your email
      pass: "spatel@123",  // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: '"Task Manager" <noreply@taskmanager.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
