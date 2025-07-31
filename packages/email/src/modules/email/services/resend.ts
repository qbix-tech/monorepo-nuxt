import type { EmailService, EmailOptions } from "../types";
import { Resend } from "resend";

export default class ResendEmailService implements EmailService {
  private overrides: {
    enable: boolean;
  };
  private resendClient: Resend;
  private emailConfig: {
    fromEmail: string | undefined;
    replyToEmail: string | undefined;
  };

  constructor() {
    this.overrides = {
      enable: process.env.EMAIL_ENABLE === "true",
    };

    const apiKey = process.env.EMAIL_RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Resend API key is missing");
    }
    this.resendClient = new Resend(apiKey);

    this.emailConfig = {
      fromEmail: process.env.EMAIL_FROM_EMAIL,
      replyToEmail:
        process.env.EMAIL_REPLY_TO_EMAIL || process.env.EMAIL_FROM_EMAIL,
    };
  }

  async send(emailOptions: EmailOptions): Promise<void> {
    if (!this.overrides.enable) throw new Error("Email service is not enabled");

    const { from, to, subject, text, html } = emailOptions;

    if (!from && !this.emailConfig.fromEmail) {
      throw new Error("Email 'from' is required");
    }

    if (!to) throw new Error("Email 'to' is required");

    if (!text && !html) throw new Error("Email 'text' or 'html' is required");

    try {
      await this.resendClient.emails.send({
        from: from || this.emailConfig.fromEmail!,
        replyTo:
          emailOptions.replyTo ||
          emailOptions.from ||
          this.emailConfig.replyToEmail ||
          this.emailConfig.fromEmail ||
          undefined,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        html,
        react: null, // not sure why resend is expecting this...
      });
      // eslint-disable-next-line no-console
      console.log("Send email is successful");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Send email failed with Resend:", error);
      throw error;
    }
  }
}
