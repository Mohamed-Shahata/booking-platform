import {
  getVreficationTemplate,
  verifyAcceptTemplate,
  verifyRejectTemplate,
} from "./mail.templates";
import sgMail from "@sendgrid/mail";
import { config } from "dotenv";
import { SubjectMail } from "../utils/constant";

config();

class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  public sendMail = async (to: string, subject: string, html: string) => {
    try {
      const msg = {
        to,
        from: `"Aistisharaticompany" <${process.env.SENDER_EMAIL}>`,
        subject,
        html,
      };

      await sgMail.send(msg);
      console.log("✅ Email sent successfully!");
    } catch (error: any) {
      console.error("❌ Failed to send email:", error.response?.body || error);
      throw new Error("Send email failed");
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
