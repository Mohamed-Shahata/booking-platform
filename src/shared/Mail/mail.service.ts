import {
  getVreficationTemplate,
  verifyAcceptTemplate,
  verifyRejectTemplate,
} from "./mail.templates";
import { config } from "dotenv";
import { Environment, SubjectMail } from "../utils/constant";
import { createTransport } from "nodemailer";
import AppError from "../errors/app.error";
import { StatusCode } from "../enums/statusCode.enum";
config();

class MailService {
  private transport;

  constructor() {
    this.transport = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  private sendMail = async (to: string, subject: string, html: string) => {
    try {
      const result = await this.transport.sendMail({
        from: `Aistisharaticompany <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        html,
      });
      console.log("send email success");
      return result;
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new AppError("Send email faild", StatusCode.BAD_REQUEST);
    }
  };

  public sendVreficationEmail = (to: string, name: string, code: string) => {
    const html = getVreficationTemplate(name, code);
    return this.sendMail(to, SubjectMail.VERIFICATION_EMAIL, html);
  };

  public sendRestPassword = (to: string, name: string, code: string) => {
    const html = getVreficationTemplate(name, code);
    return this.sendMail(to, SubjectMail.REST_PASSWORD, html);
  };

  public verifyAcceptEmail = (to: string, name: string) => {
    const html = verifyAcceptTemplate(name);
    return this.sendMail(to, SubjectMail.ACCEPT_EMAIL, html);
  };

  public verifyRejectEmail = (to: string, name: string) => {
    const html = verifyRejectTemplate(name);
    return this.sendMail(to, SubjectMail.REJECT_EMAIL, html);
  };
}

const mailService = new MailService();
export default mailService;
