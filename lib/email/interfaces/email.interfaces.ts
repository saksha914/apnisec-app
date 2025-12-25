export interface IEmailService {
  sendWelcomeEmail(to: string, name: string): Promise<void>;
  sendIssueCreatedEmail(to: string, issue: IssueEmailData): Promise<void>;
  sendPasswordResetEmail(to: string, resetLink: string): Promise<void>;
}

export interface IssueEmailData {
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  createdBy: string;
}