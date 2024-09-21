const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer configuration
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server
    port: process.env.SMTP_PORT, // Secure port
    secure: true, // Use SSL/TLS
    auth: {
      user: process.env.SMTP_USER, // Email username from .env
      pass: process.env.SMTP_PASS, // Email password from .env
    },
});

// Route for handling form submission
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;
  
    const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL, // Receiver email from .env
      subject: `New Contact Form Submission from ${name}`,
      text: `You have a new submission: \n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send('There was an error sending the message.');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Thank you for contacting us! We will get back to you soon.');
      }
    });
});

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Meraki Therapeutics' });
});

app.get('/services', (req, res) => {
    res.render('services', { title: 'Services and Pricing' });
});

app.get('/why_meraki', (req, res) => {
    res.render('why_meraki', { title: 'Why Meraki' });
});

app.get('/team', (req, res) => {
    res.render('team', { title: 'Meet the Team' });
});

app.get('/faq', (req, res) => {
    res.render('faq', { title: 'FAQ' });
});

app.get('/specials', (req, res) => {
  res.render('specials', { title: 'Specials and Events' });
});

app.get('/location', (req, res) => {
  res.render('location', { 
      title: 'Location + Hours', 
      apiKey: process.env.GOOGLE_MAPS_API_KEY 
  });
});



app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy', { title: 'Privacy and Policy' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
