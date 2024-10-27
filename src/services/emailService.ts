import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aetherscode@gmail.com',
    pass: 'ihsynmfecsxgzmfr'
  }
});

export const sendEmail = async (name: string, email: string, message: string) => {
  const mailOptions = {
    from: 'aetherscode@gmail.com',
    to: 'aetherscode@gmail.com',
    subject: `New contact form submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
