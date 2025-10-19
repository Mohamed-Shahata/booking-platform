export const getVreficationTemplate = (name: string, code: string): string => {
  return `
    <h1>Welcome, ${name}!</h1>
    <p>Please verify your account using the code below:</p>
    <h2>${code}</h2>
  `;
};
