import { Options } from 'nodemailer/lib/smtp-transport';
import { get } from 'env-var';

export const smtpConfig: Options = {
  host: get('SMTP_HOST').required().asString(),
  port: get('SMTP_PORT').default(465).asPortNumber(),
  secure: get('SMTP_SECURE').default('true').asBool(),
  from: get('SMTP_EMAIL').required().asEmailString(),
  auth: {
    user: get('SMTP_EMAIL').required().asEmailString(),
    pass: get('SMTP_PASS').required().asString(),
  },
};
