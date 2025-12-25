export const passwordResetEmailTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Password Reset Request</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #667eea;">Reset Your Password</h2>
    
    <p style="font-size: 16px;">We received a request to reset the password for your ApniSec account.</p>
    
    <p style="font-size: 16px;">If you made this request, click the button below to reset your password:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
    </div>
    
    <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
    <p style="font-size: 14px; word-break: break-all; background-color: #fff; padding: 10px; border-radius: 5px;">
      ${resetLink}
    </p>
    
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0; color: #856404;">
        <strong>Important:</strong> This link will expire in 1 hour for security reasons.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.</p>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">For security reasons, we recommend:</p>
    <ul style="font-size: 14px; color: #666;">
      <li>Using a strong, unique password</li>
      <li>Not sharing your password with anyone</li>
      <li>Enabling two-factor authentication when available</li>
    </ul>
    
    <p style="font-size: 16px; margin-top: 30px;">Best regards,<br><strong>The ApniSec Security Team</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>&copy; 2024 ApniSec. All rights reserved.</p>
    <p>This is an automated security email, please do not reply directly.</p>
  </div>
</body>
</html>
`;