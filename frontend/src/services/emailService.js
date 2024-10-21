// services/emailService.js
const sgMail = require('@sendgrid/mail');

// Set your SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailNotification = (toEmail, subject, text) => {
  const msg = {
    to: toEmail, // Recipient's email address
    from: 'noreply@yourdomain.com', // Verified sender email
    subject: subject, // Subject of the email
    text: text, // Text content
    html: `<p>${text}</p>`, // HTML content
  };

  // Send the email using SendGrid
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

module.exports = { sendEmailNotification };
