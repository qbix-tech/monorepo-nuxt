export type EmailProvider = "smtp" | "resend";

export type EmailService = {
  send(emailOptions: EmailOptions): Promise<void>;
};

export type EmailOptions = {
  from?: string;
  replyTo?: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
};
