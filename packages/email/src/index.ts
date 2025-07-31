import type { EmailProvider, EmailOptions } from "./modules/email";
import type { TemplateName, ExtractComponentProps, Templates } from "./types";
import { SMTPService, ResendEmailService } from "./modules/email";
import * as emailTemplates from "./templates";
import { defineBase } from "./helpers/define-base";
import renderEmail from "./helpers/render-email";
import emailConfig from "../email.config";

const apply = defineBase({
  commons: {
    logoUrl: emailConfig.defaults?.logoUrl,
    heroImageUrl: emailConfig.defaults?.heroImageUrl,
  },
});

export const useEmail = (provider?: EmailProvider) => {
  let _provider: SMTPService | ResendEmailService | null = null;

  if (!provider) {
    const { EMAIL_DEFAULT, EMAIL_RESEND_API_KEY } = process.env;

    if (EMAIL_DEFAULT) {
      // eslint-disable-next-line no-console
      console.info("Detected default from configuration:", EMAIL_DEFAULT);
      provider = EMAIL_DEFAULT as unknown as EmailProvider;
    } else if (EMAIL_RESEND_API_KEY) {
      // eslint-disable-next-line no-console
      console.info('Detected RESEND API KEY, switching default to "Resend"');
      provider = "resend";
    } else {
      // eslint-disable-next-line no-console
      console.info(
        'Unable to determine default email option, falling back to "SMTP"',
      );
      provider = "smtp";
    }
  }

  switch (provider) {
    case "smtp":
      _provider = new SMTPService();
      break;
    case "resend":
      _provider = new ResendEmailService();
      break;
    default:
      throw new Error(`Unsupported email provider: ${provider}`);
  }

  const send = async (opts: EmailOptions) => {
    await _provider.send(opts);
  };

  const render = async <T extends TemplateName>(
    templateName: T,
    props:
      | Omit<ExtractComponentProps<Templates[T]>, "commons">
      | ExtractComponentProps<Templates[T]>,
  ) => {
    return await renderEmail(
      emailTemplates[templateName],
      apply.withBase(props) as ExtractComponentProps<Templates[T]>,
    );
  };

  const renderAndSend = async <T extends TemplateName>(
    templateName: T,
    props:
      | Omit<ExtractComponentProps<Templates[T]>, "commons">
      | ExtractComponentProps<Templates[T]>,
    opts: Omit<EmailOptions, "text" | "html">,
  ) => {
    const { html, text } = await render(templateName, props);

    if (!html || !text)
      throw new Error(`Fail to render email: ${templateName}`);

    return await send({
      ...opts,
      html,
      text,
    });
  };

  return {
    send,
    render,
    renderAndSend,
  };
};

export * from "./types";
export * as templates from "./templates";
export * from "./helpers/define-base";
export * from "./helpers/mock-helper";
export { default as renderEmail } from "./helpers/render-email";
export * from "./modules/email";
export { default as emailConfig } from "../email.config";
