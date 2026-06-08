/**
 * Generates the HTML email template for OTP delivery.
 *
 * @param otp - The 4-digit OTP code
 * @param expiryMinutes - How many minutes until the OTP expires
 * @returns HTML string for the email body
 */
export const getOtpEmailTemplate = (
  otp: string,
  expiryMinutes: number,
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
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
                Your Verification Code
              </h2>
              <p style="margin: 0 0 24px; color: #4a4a68; font-size: 15px; line-height: 1.6;">
                Use the code below to verify your NUI Gold account. This code is valid for <strong>${expiryMinutes} minutes</strong>.
              </p>

              <!-- OTP Code -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <div style="display: inline-block; background-color: #f9f5ec; border: 2px dashed #D4A843; border-radius: 12px; padding: 20px 48px;">
                      <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #1a1a2e; font-family: 'Courier New', Courier, monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px; color: #4a4a68; font-size: 14px; line-height: 1.6;">
                If you didn't request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
              </p>

              <!-- Security Notice -->
              <p style="margin: 24px 0 0; color: #e74c3c; font-size: 13px; font-weight: 600; line-height: 1.5;">
                ⚠️ Never share this code with anyone. NUI Gold will never ask for your verification code.
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
