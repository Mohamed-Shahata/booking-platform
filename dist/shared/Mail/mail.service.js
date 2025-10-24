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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_templates_1 = require("./mail.templates");
const dotenv_1 = require("dotenv");
const constant_1 = require("../utils/constant");
const resend_1 = require("resend");
const app_error_1 = __importDefault(require("../errors/app.error"));
const statusCode_enum_1 = require("../enums/statusCode.enum");
(0, dotenv_1.config)();
class MailService {
    constructor() {
        this.sendMail = (to, subject, html) => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = this.resend.emails.send({
                    from: process.env.SMTP_USERNAME,
                    to,
                    subject,
                    html,
                });
                console.log("send enmail success");
                return res;
            }
            catch (err) {
                console.log("failed send email: ", err);
                throw new app_error_1.default("Failed send email", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
        });
        this.sendVreficationEmail = (to, name, code) => {
            const html = (0, mail_templates_1.getVreficationTemplate)(name, code);
            return this.sendMail(to, constant_1.SubjectMail.VERIFICATION_EMAIL, html);
        };
        this.sendRestPassword = (to, name, code) => {
            const html = (0, mail_templates_1.getVreficationTemplate)(name, code);
            return this.sendMail(to, constant_1.SubjectMail.REST_PASSWORD, html);
        };
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
}
const mailService = new MailService();
exports.default = mailService;
