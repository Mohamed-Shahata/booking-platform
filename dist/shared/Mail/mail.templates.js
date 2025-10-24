"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVreficationTemplate = void 0;
const getVreficationTemplate = (name, code) => {
    return `
    <h1>Welcome, ${name}!</h1>
    <p>Please verify your account using the code below:</p>
    <h2>${code}</h2>
  `;
};
exports.getVreficationTemplate = getVreficationTemplate;
