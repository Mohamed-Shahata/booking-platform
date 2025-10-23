import { createTransport } from "nodemailer";
import { getVreficationTemplate } from "./mail.templates";
import { config } from "dotenv";
import { Environment, SubjectMail } from "../utils/constant";
config();

class MailService {
  private transport;

  constructor() {
    this.transport = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.NODE_ENV === Environment.PRODUCTION ? true : false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  private sendMail = async (to: string, subject: string, html: string) => {
    return await this.transport.sendMail({
      from: `"My App" <${process.env.SMTP_USERNAME}>`,
      to,
      subject,
      html,
    });
  };

  public sendVreficationEmail = (to: string, name: string, code: string) => {
    const html = getVreficationTemplate(name, code);
    return this.sendMail(to, SubjectMail.VERIFICATION_EMAIL, html);
  };
  public sendRestPassword = (to: string, name: string, code: string) => {
    const html = getVreficationTemplate(name, code);
    return this.sendMail(to, SubjectMail.REST_PASSWORD, html);
  };
}

const mailService = new MailService();
export default mailService;
