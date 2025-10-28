"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRejectTemplate = exports.verifyAcceptTemplate = exports.getVreficationTemplate = void 0;
const getVreficationTemplate = (name, code) => {
    return `
    <h1>Welcome, ${name}!</h1>
    <p>Please verify your account using the code below:</p>
    <h2>${code}</h2>
  `;
};
exports.getVreficationTemplate = getVreficationTemplate;
const verifyAcceptTemplate = (name) => {
    return `
    <h3>Hello ${name},</h3>
    <p>Congratulations! 🎉</p>
    <p>Your expert verification request has been <b>approved</b>.</p>
    <p>You can now access all expert features on our platform.</p>
    <p>Welcome aboard!</p>
  `;
};
exports.verifyAcceptTemplate = verifyAcceptTemplate;
const verifyRejectTemplate = (name) => {
    return `
    <h3>Hello ${name},</h3>
    <p>We regret to inform you that your expert verification request has been <b>rejected</b>.</p>
    <p>If you believe this is a mistake, please contact our support team.</p>
    <p>Thank you for your understanding.</p>
  `;
};
exports.verifyRejectTemplate = verifyRejectTemplate;
