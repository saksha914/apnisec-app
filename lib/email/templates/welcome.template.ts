export const welcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ApniSec</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Welcome to ApniSec!</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #667eea;">Hello ${name || 'there'},</h2>
    
    <p style="font-size: 16px;">Welcome to ApniSec - Your trusted cybersecurity partner!</p>
    
    <p style="font-size: 16px;">We're thrilled to have you on board. ApniSec is dedicated to providing top-notch security solutions including:</p>
    
    <ul style="font-size: 16px; line-height: 1.8;">
      <li><strong>Cloud Security:</strong> Protect your cloud infrastructure</li>
      <li><strong>Red Team Assessment:</strong> Comprehensive security testing</li>
      <li><strong>VAPT:</strong> Vulnerability Assessment and Penetration Testing</li>
    </ul>
    
    <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="margin-top: 0; color: #667eea;">Get Started</h3>
      <p>You can now:</p>
      <ul>
        <li>Create and manage security issues</li>
        <li>Track vulnerability assessments</li>
        <li>Monitor your security status</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
    
    <p style="font-size: 16px;">Best regards,<br><strong>The ApniSec Team</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>&copy; 2024 ApniSec. All rights reserved.</p>
    <p>This is an automated email, please do not reply directly.</p>
  </div>
</body>
</html>
`;