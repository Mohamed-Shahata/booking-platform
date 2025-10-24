import { getVreficationTemplate } from "./mail.templates";
import { config } from "dotenv";
import { SubjectMail } from "../utils/constant";
import { Resend } from "resend";
import AppError from "../errors/app.error";
import { StatusCode } from "../enums/statusCode.enum";
config();

class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private sendMail = async (to: string, subject: string, html: string) => {
    try {
      const res = this.resend.emails.send({
        from: process.env.SMTP_USERNAME!,
        to,
        subject,
        html,
      });
      console.log("send enmail success");
      return res;
    } catch (err) {
      console.log("failed send email: ", err);
      throw new AppError("Failed send email", StatusCode.BAD_REQUEST);
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
}

const mailService = new MailService();
export default mailService;
