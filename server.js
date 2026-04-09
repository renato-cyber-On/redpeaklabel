require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD || !process.env.GMAIL_RECIPIENT) {
  console.error('Error: Missing required environment variables (GMAIL_USER, GMAIL_PASSWORD, GMAIL_RECIPIENT)');
  console.error('Please create a .env file based on .env.example');
  process.exit(1);
}

// CORS configuration - restrict to trusted origins
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting for contact endpoint to prevent spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many contact form submissions, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname)));

// Configure email service with environment variables
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Test connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server ready to send messages');
  }
});

/**
 * Sanitizes user input to prevent injection attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 500); // Limit length
}

// Contact form submission endpoint with rate limiting
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    let { name, surname, email, message } = req.body;

    // Sanitize all inputs
    name = sanitizeInput(name);
    surname = sanitizeInput(surname);
    email = sanitizeInput(email);
    message = sanitizeInput(message);

    // Validate fields are not empty after sanitization
    if (!name || !surname || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields.'
      });
    }

    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Additional validation - min/max lengths
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 50 characters.'
      });
    }

    if (message.length < 10 || message.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 500 characters.'
      });
    }

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_RECIPIENT,
      replyTo: email,
      subject: `Contact from ${name} ${surname}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name} ${surname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`RedPeakLabel server running on http://localhost:${PORT}`);
});
