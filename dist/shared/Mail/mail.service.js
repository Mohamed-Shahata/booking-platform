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
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = require("dotenv");
const constant_1 = require("../utils/constant");
(0, dotenv_1.config)();
class MailService {
    constructor() {
        this.sendMail = (to, subject, html) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const msg = {
                    to,
                    from: `"Aistisharaticompany" <${process.env.SENDER_EMAIL}>`,
                    subject,
                    html,
                };
                yield mail_1.default.send(msg);
                console.log("✅ Email sent successfully!");
            }
            catch (error) {
                console.error("❌ Failed to send email:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.body) || error);
                throw new Error("Send email failed");
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
        this.verifyAcceptEmail = (to, name) => {
            const html = (0, mail_templates_1.verifyAcceptTemplate)(name);
            return this.sendMail(to, constant_1.SubjectMail.ACCEPT_EMAIL, html);
        };
        this.verifyRejectEmail = (to, name) => {
            const html = (0, mail_templates_1.verifyRejectTemplate)(name);
            return this.sendMail(to, constant_1.SubjectMail.REJECT_EMAIL, html);
        };
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    }
}
const mailService = new MailService();
exports.default = mailService;
