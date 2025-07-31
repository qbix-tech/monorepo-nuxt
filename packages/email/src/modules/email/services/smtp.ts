import type { EmailService, EmailOptions } from "../types";
import { SMTPClient, type SMTPConnectionOptions, Message } from "emailjs";

export default class SMTPService implements EmailService {
  private overrides: {
    enable: boolean;
  };
  private smtpClient: SMTPClient;
  private smtpConnectionOptions: Partial<
    SMTPConnectionOptions & {
      fromEmail: string;
      replyToEmail: string;
    }
  >;

  constructor() {
    this.overrides = {
      enable: process.env.EMAIL_ENABLE === "true",
    };

    this.smtpConnectionOptions = {
      host: process.env.EMAIL_SMTP_HOST,
      // transpose smtp.port to number if it's a string
      port: process.env.EMAIL_SMTP_PORT
        ? parseInt(process.env.EMAIL_SMTP_PORT)
        : 587,
      user: process.env.EMAIL_SMTP_USER,
      password: process.env.EMAIL_SMTP_PASS,
      fromEmail: process.env.EMAIL_FROM_EMAIL,
      replyToEmail:
        process.env.EMAIL_REPLY_TO_EMAIL || process.env.EMAIL_FROM_EMAIL,
      // evaluate string as bool
      tls: process.env.EMAIL_SMTP_TLS === "true",
    };

    if (
      !this.smtpConnectionOptions ||
      !this.smtpConnectionOptions.host ||
      !this.smtpConnectionOptions.port ||
      !this.smtpConnectionOptions.user ||
      !this.smtpConnectionOptions.password
    ) {
      throw new Error("SMTP configuration is missing");
    }

    this.smtpClient = new SMTPClient(this.smtpConnectionOptions);
  }

  async send(emailOptions: EmailOptions): Promise<void> {
    if (!this.overrides.enable) throw new Error("Email service is not enabled");

    const { to, subject, html, text } = emailOptions;

    if (!to) throw new Error("Email 'to' is required");

    if (!text && !html) throw new Error("Email 'text' or 'html' is required");

    const message = new Message({
      from: emailOptions.from || this.smtpConnectionOptions.fromEmail,
      "reply-to":
        emailOptions.replyTo ||
        emailOptions.from ||
        this.smtpConnectionOptions.replyToEmail ||
        this.smtpConnectionOptions.fromEmail ||
        undefined,
      to,
      subject,
      text,
      attachment: html ? [{ data: html, alternative: true }] : undefined,
    });

    const { isValid, validationError } = message.checkValidity();

    if (!isValid) throw new Error(validationError);

    try {
      await this.smtpClient.sendAsync(message);
      // eslint-disable-next-line no-console
      console.info("Send email is successful");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Send email failed with SMTP:", error);
      throw error;
    }
  }
}
