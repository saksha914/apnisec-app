import { IssueEmailData } from '../interfaces/email.interfaces';

export const issueCreatedEmailTemplate = (issue: IssueEmailData) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Issue Created</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">New Issue Created</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #667eea;">Issue Details</h2>
    
    <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">${issue.title}</h3>
      
      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">
        <span style="background-color: ${getTypeColor(issue.type)}; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold;">
          ${issue.type.replace('_', ' ')}
        </span>
        <span style="background-color: ${getPriorityColor(issue.priority)}; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold;">
          ${issue.priority}
        </span>
        <span style="background-color: ${getStatusColor(issue.status)}; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold;">
          ${issue.status}
        </span>
      </div>
      
      <div style="border-top: 1px solid #eee; margin-top: 15px; padding-top: 15px;">
        <h4 style="color: #667eea; margin-top: 0;">Description:</h4>
        <p style="white-space: pre-wrap;">${issue.description}</p>
      </div>
      
      <div style="border-top: 1px solid #eee; margin-top: 15px; padding-top: 15px;">
        <p style="font-size: 14px; color: #666;">
          <strong>Created by:</strong> ${issue.createdBy}
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View in Dashboard</a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 30px;">This issue has been added to your ApniSec dashboard for tracking and management.</p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>&copy; 2024 ApniSec. All rights reserved.</p>
    <p>This is an automated notification. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;

function getTypeColor(type: string): string {
  switch (type) {
    case 'CLOUD_SECURITY':
      return '#3b82f6';
    case 'RETEAM_ASSESSMENT':
      return '#ef4444';
    case 'VAPT':
      return '#f59e0b';
    default:
      return '#6b7280';
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL':
      return '#dc2626';
    case 'HIGH':
      return '#ea580c';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#84cc16';
    default:
      return '#6b7280';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'OPEN':
      return '#3b82f6';
    case 'IN_PROGRESS':
      return '#f59e0b';
    case 'RESOLVED':
      return '#10b981';
    case 'CLOSED':
      return '#6b7280';
    default:
      return '#6b7280';
  }
}