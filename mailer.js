const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load custom variables from environment
const EMAIL = "johndoe@gmail.com";  // Replace with your email

// Load credentials and token
let credentials, token;
try {
  credentials = JSON.parse(fs.readFileSync('client.json'));
  token = JSON.parse(fs.readFileSync('token.json'));
  console.log('Credentials and token loaded successfully');  // Debug log
} catch (error) {
  console.error('Error loading credentials or token:', error);
  process.exit(1);
}

const { client_secret, client_id, redirect_uris } = credentials.installed;
const { refresh_token } = token;

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

oauth2Client.setCredentials({ refresh_token });

// Load recipients
let mail;
try {
  mail = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'recipients.json')));
  console.log('Recipients loaded:', mail);  // Debug log
} catch (error) {
  console.error('Error loading recipients:', error);
  process.exit(1);
}

async function mailSender() {
  try {
    const targetEmails = mail.recievers || [];  // Note: 'recievers' is misspelled
    console.log('Target emails:', targetEmails);  // Debug log
    let successCount = 0;
    let failureCount = 0;

    // Get access token
    console.log('Getting access token...');  // Debug log
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;
    console.log('Access token obtained');  // Debug log

    // Create reusable transporter object using OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL,
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: refresh_token,
        accessToken: accessToken,
      },
    });

    // Iterate through target emails and send emails
    for (const target of targetEmails) {
      if (!target) {
        console.log('Skipping empty target');  // Debug log
        continue;
      }
      try {
        console.log(`Attempting to send email to ${target.email}`);  // Debug log
        await transporter.sendMail({
          from: `${mail.name} <${mail.email || EMAIL}>`,
          to: target.email,
          subject: mail.subject.replace('${name}', target.name),
          text: '',
          html: mail.body.replace('${name}', target.name) || 'Please Ignore This Email',
        });
        successCount++;
        console.log(`Email sent successfully to ${target.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${target.email}`, err);
        failureCount++;
      }
    }

    console.log(`Emails sent: ${successCount}, Failed attempts: ${failureCount}`);
  } catch (err) {
    console.error('Error in mailSender function:', err);
  }
}

module.exports = mailSender;