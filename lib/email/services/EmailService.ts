import { Resend } from 'resend';
import { IEmailService, IssueEmailData } from '../interfaces/email.interfaces';
import { welcomeEmailTemplate } from '../templates/welcome.template';
import { issueCreatedEmailTemplate } from '../templates/issue-created.template';
import { passwordResetEmailTemplate } from '../templates/password-reset.template';

export class EmailService implements IEmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
    }
    
    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@apnisec.com';
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email Mock] Welcome email to ${to} for ${name}`);
      return;
    }

    try {
      const html = welcomeEmailTemplate(name);
      
      await this.resend.emails.send({
        from: `ApniSec <${this.fromEmail}>`,
        to: [to],
        subject: 'Welcome to ApniSec - Your Security Journey Begins!',
        html,
      });
      
      console.log(`Welcome email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  async sendIssueCreatedEmail(to: string, issue: IssueEmailData): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email Mock] Issue created email to ${to} for issue: ${issue.title}`);
      return;
    }

    try {
      const html = issueCreatedEmailTemplate(issue);
      
      await this.resend.emails.send({
        from: `ApniSec <${this.fromEmail}>`,
        to: [to],
        subject: `New ${issue.type.replace('_', ' ')} Issue: ${issue.title}`,
        html,
      });
      
      console.log(`Issue created email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send issue created email:', error);
      throw new Error('Failed to send issue created email');
    }
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email Mock] Password reset email to ${to} with link: ${resetLink}`);
      return;
    }

    try {
      const html = passwordResetEmailTemplate(resetLink);
      
      await this.resend.emails.send({
        from: `ApniSec Security <${this.fromEmail}>`,
        to: [to],
        subject: 'Password Reset Request - ApniSec',
        html,
      });
      
      console.log(`Password reset email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}