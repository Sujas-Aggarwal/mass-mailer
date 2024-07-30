# OAuth2 Gmail Sender

This project allows you to send emails using Gmail's API with OAuth2 authentication. It's designed to be secure and avoid issues with less secure app access or username/password authentication.

## Prerequisites

- Node.js installed on your system
- A Google Cloud Platform account
- Gmail API enabled in your Google Cloud project

## Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Google Cloud Project:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Gmail API for your project
   - Go to "APIs & Services" > "Credentials"
   - Create OAuth client ID credentials (choose "Desktop app" as the application type)
   - Download the credentials and save them as `client.json` in the project root

4. Set up OAuth2:
   - Run the OAuth2 setup script:
     ```
     node oauth2.js
     ```
   - Follow the prompts to authorize the application
   - This will create a `token.json` file in your project root

5. Create a `recipients.json` file in the project root with the following structure:
   ```json
   {
     "name": "Your Name",
     "email": "your-email@example.com",
     "subject": "Email Subject ${name}",
     "body": "Email Body ${name}",
     "receivers": [
       { "name": "Recipient Name", "email": "recipient@example.com" }
     ]
   }
   ```
6. Change the EMAIL Variable in mailer.js to Your EMAIL whose access token you have generated.
## Usage

To send emails, run:

```
node index.js
```

The script will read the recipients from `recipients.json` and send emails accordingly.

## Troubleshooting

If you encounter authentication errors:

1. Ensure your Google Cloud project has the Gmail API enabled
2. Check that your OAuth consent screen includes the necessary scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://mail.google.com/`
4. If issues persist, try regenerating your OAuth credentials and obtaining a new refresh token

## Security Notes

- Keep your `client.json` and `token.json` files secure. Do not share them or commit them to public repositories.
- The OAuth2 method is more secure than using your Gmail password or less secure app access.

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or encounter any problems.

## License

[MIT License](LICENSE)