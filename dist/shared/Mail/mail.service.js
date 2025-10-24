"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const mail_templates_1 = require("./mail.templates");
const dotenv_1 = require("dotenv");
const constant_1 = require("../utils/constant");
(0, dotenv_1.config)();
class MailService {
    constructor() {
        this.sendMail = (to, subject, html) => __awaiter(this, void 0, void 0, function* () {
            return yield this.transport.sendMail({
                from: `"My App" <${process.env.SMTP_USERNAME}>`,
                to,
                subject,
                html,
            });
        });
        this.sendVreficationEmail = (to, name, code) => {
            const html = (0, mail_templates_1.getVreficationTemplate)(name, code);
            return this.sendMail(to, constant_1.SubjectMail.VERIFICATION_EMAIL, html);
        };
        this.sendRestPassword = (to, name, code) => {
            const html = (0, mail_templates_1.getVreficationTemplate)(name, code);
            return this.sendMail(to, constant_1.SubjectMail.REST_PASSWORD, html);
        };
        this.transport = (0, nodemailer_1.createTransport)({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.NODE_ENV === constant_1.Environment.PRODUCTION ? true : false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
}
const mailService = new MailService();
exports.default = mailService;
