const path = require('path');
const fs = require('fs');
const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, 'pass.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error) => {
  if (error) {
    console.error('SMTP configuration error:', error?.message || error);
  } else {
    console.log('SMTP connection verified.');
  }
});

app.post('/api/contact', async (req, res) => {
  const subject = String(req.body?.subject || '').trim();
  const email = String(req.body?.email || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!subject || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const receiver = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: `"RAGX Website Contact" <${process.env.SMTP_USER}>`,
      to: receiver,
      replyTo: email,
      subject: `Website Contact: ${subject}`,
      text: [
        `From: ${email}`,
        '',
        'Message:',
        message
      ].join('\n')
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact email send failed:', {
      message: error?.message,
      code: error?.code,
      response: error?.response
    });
    return res.status(500).json({ error: 'Email delivery failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
