export const getVreficationTemplate = (name: string, code: string): string => {
  return `
    <h1>Welcome, ${name}!</h1>
    <p>Please verify your account using the code below:</p>
    <h2>${code}</h2>
  `;
};
export const verifyAcceptTemplate = (name: string): string => {
  return `
    <h3>Hello ${name},</h3>
    <p>Congratulations! 🎉</p>
    <p>Your expert verification request has been <b>approved</b>.</p>
    <p>You can now access all expert features on our platform.</p>
    <p>Welcome aboard!</p>
  `;
}
export const verifyRejectTemplate = (name: string): string => {
  return`
    <h3>Hello ${name},</h3>
    <p>We regret to inform you that your expert verification request has been <b>rejected</b>.</p>
    <p>If you believe this is a mistake, please contact our support team.</p>
    <p>Thank you for your understanding.</p>
  `;
};