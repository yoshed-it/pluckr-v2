# Firebase Trigger Email Extension Configuration

## Extension Setup

1. **Install Firebase Extension**:
   ```bash
   firebase ext:install firebase/firestore-send-email
   ```

2. **Configuration Parameters**:
   - **SMTP Connection URI**: Configure with your email provider (Gmail, SendGrid, etc.)
   - **Default FROM email**: `support@pluckr.app`
   - **Default Reply TO email**: `support@pluckr.app`
   - **Users collection**: `users`
   - **Mail collection**: `mail`
   - **Templates collection**: `mailTemplates`

## Quick Setup Commands

```bash
# 1. Install the extension
firebase ext:install firebase/firestore-send-email --project=your-firebase-project-id

# 2. Configure SMTP (example for Gmail)
# When prompted, use:
# SMTP_CONNECTION_URI: smtps://support%40pluckr.app:YOUR_APP_PASSWORD@smtp.gmail.com:465
# DEFAULT_FROM: support@pluckr.app
# DEFAULT_REPLY_TO: support@pluckr.app
```

## Email Template: Organization Invitation

Create this template in Firestore `mailTemplates/organizationInvitation`:

```json
{
  "subject": "Invitation to join {{orgName}} on Pluckr",
  "html": "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Join {{orgName}} on Pluckr</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px}.header{background:#7FA585;color:white;padding:30px 20px;text-align:center;border-radius:8px 8px 0 0}.content{background:#f9f9f9;padding:30px 20px;border-radius:0 0 8px 8px}.button{display:inline-block;background:#4A9B8E;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;margin:20px 0}.footer{text-align:center;color:#666;font-size:14px;margin-top:30px}</style></head><body><div class=\"header\"><h1>You're Invited to Join {{orgName}}</h1></div><div class=\"content\"><p>Hello,</p><p>You've been invited to join <strong>{{orgName}}</strong> on Pluckr, the professional clinical charting platform.</p><p>Click the button below to accept your invitation and set up your account:</p><p style=\"text-align:center\"><a href=\"{{inviteURL}}\" class=\"button\">Accept Invitation</a></p><p>Or copy and paste this link into your browser:<br><code>{{inviteURL}}</code></p><p>This invitation will expire in 7 days.</p><p>If you have any questions, please contact us at support@pluckr.app</p></div><div class=\"footer\"><p>Pluckr - Professional Clinical Charting<br><a href=\"https://pluckr.app\">pluckr.app</a></p></div></body></html>",
  "text": "You've been invited to join {{orgName}} on Pluckr!\n\nClick this link to accept your invitation: {{inviteURL}}\n\nThis invitation expires in 7 days.\n\nQuestions? Contact support@pluckr.app\n\nPluckr - Professional Clinical Charting\nhttps://pluckr.app"
}
```

## Testing the Setup

1. **Create the template in Firestore**:
   - Go to Firebase Console → Firestore Database
   - Create collection: `mailTemplates`
   - Create document: `organizationInvitation`
   - Add the template data above

2. **Test email sending**:
   ```javascript
   // Add this document to trigger an email
   db.collection('mail').add({
     to: 'test@example.com',
     template: {
       name: 'organizationInvitation',
       data: {
         orgName: 'Test Organization',
         inviteURL: 'https://pluckr.app/invite/test-token'
       }
     }
   });
   ```

## Security Notes

- The extension automatically deletes processed mail documents
- Failed deliveries are logged in the extension logs
- SMTP credentials are stored securely in Firebase Functions configuration
- All emails are scoped to your Firebase project

## Next Steps

1. Install the extension with your Firebase project
2. Configure SMTP with support@pluckr.app credentials  
3. Create the email template in Firestore
4. Test with a sample invitation
5. Deploy the updated app with new invitation system 