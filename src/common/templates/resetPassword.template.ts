export const getResetPasswordEmailTemplate = (
  resetLink: string,
  expiryMinutes: Date,
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4A843 0%, #B8912A 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                NUI GOLD
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 22px; font-weight: 600;">
                Reset Your Password
              </h2>
              <p style="margin: 0 0 24px; color: #4a4a68; font-size: 15px; line-height: 1.6;">
                We received a request to reset the password for your NUI Gold account. Click the button below to set a new password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #D4A843 0%, #B8912A 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px; color: #4a4a68; font-size: 14px; line-height: 1.6;">
                This link will expire in <strong>${expiryMinutes} minutes</strong>. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
              </p>

              <!-- Fallback Link -->
              <p style="margin: 24px 0 0; color: #9999aa; font-size: 12px; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color: #D4A843; word-break: break-all;">${resetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9fb; padding: 24px 40px; border-top: 1px solid #ececf0;">
              <p style="margin: 0; color: #9999aa; font-size: 12px; text-align: center; line-height: 1.5;">
                This is an automated message from NUI Gold. Please do not reply to this email.<br>
                &copy; ${new Date().getFullYear()} NUI Gold. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};