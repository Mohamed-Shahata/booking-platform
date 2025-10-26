# Booking Platform

## Overview
The Booking Platform is a real-time appointment and consultation booking system built with Node.js, Express.js, and TypeScript. It connects clients with experts across various fields such as IT, healthcare, and business. Users can browse experts, schedule sessions, make online payments via Stripe and PayPal, and join live chat or video consultations with features like time tracking and notifications. The backend API is designed for scalability, security, and maintainability, leveraging MongoDB for data storage, Cloudinary for media handling, and Swagger for API documentation.

## Features
- **User Authentication**: Secure signup/login with bcrypt password hashing, JWT tokens, and Google OAuth integration.
- **Expert and Client Management**: Browse expert profiles, book appointments, and manage user accounts.
- **Scheduling**: Real-time session booking with calendar integration.
- **Payments**: Integration with Stripe and PayPal for secure online payments (Note: Ensure payment SDKs are installed if not present).
- **Media Uploads**: Image and file uploads via Cloudinary and Multer.
- **Email Notifications**: Automated emails for confirmations, reminders, and more using Resend.
- **Scheduled Tasks**: Background jobs (e.g., reminders) using node-cron.
- **API Documentation**: Interactive API docs via Swagger UI at `/api-docs`.
- **Security**: Helmet for secure HTTP headers, CORS for cross-origin requests, and input validation with Zod.
- **Performance**: Response compression for faster API responses.

## Prerequisites
- **Node.js**: Version 18 or higher.
- **MongoDB**: Local instance or cloud-based (e.g., MongoDB Atlas).
- **Cloudinary**: Account for image/file storage.
- **Google OAuth**: Credentials for social login.
- **Resend**: API key for email notifications.
- **Stripe/PayPal**: API keys for payment processing (if implemented).
- Environment variables configured in a `.env` file.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Booking-platform


2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/booking-platform
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RESEND_API_KEY=your_resend_api_key
   STRIPE_SECRET_KEY=your_stripe_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_secret
   ```

4. Build the TypeScript code:

   ```bash
   npm run build
   ```

## Usage

* **Development Mode** (with live reloading):

  ```bash
  npm run dev
  ```

  Uses `ts-node-dev` to watch for changes and restart the server automatically.

* **Production Mode**:

  ```bash
  npm run build
  npm start
  ```

The server runs on `http://localhost:5000` (or the port specified in `.env`). Access the Swagger API documentation at `http://localhost:5000/api-docs`.

## Scripts

* `npm start`: Run the compiled JavaScript server.
* `npm run dev`: Run in development mode with TypeScript and live reloading.
* `npm run build`: Compile TypeScript files to JavaScript in the `dist` directory.

## Directory Structure

* `src/`: Source code (TypeScript files).

  * `server.ts`: Main entry point for the application.
  * (Assumed: routes, controllers, models, middlewares, and utilities folders).
* `dist/`: Compiled JavaScript output.
* `node_modules/`: Project dependencies, including AWS crypto libraries for potential encryption tasks.
* `tsconfig.json`: TypeScript configuration file.

## Dependencies

### Production

* `bcryptjs`: Password hashing for secure authentication.
* `cloudinary`: Cloud storage for images and files.
* `compression`: Gzip compression for API responses.
* `cookie-parser`: Parse HTTP cookies.
* `cors`: Enable cross-origin resource sharing.
* `dotenv`: Load environment variables.
* `express`: Core web framework.
* `express-async-handler`: Handle async errors in Express routes.
* `google-auth-library`: Google OAuth authentication.
* `helmet`: Secure HTTP headers.
* `jsonwebtoken`: JWT-based authentication.
* `mongoose`: MongoDB object modeling.
* `multer`: Handle file uploads.
* `node-cron`: Schedule background tasks.
* `nodemon`: Monitor server changes (used in production?).
* `path`: File path utilities.
* `resend`: Email notification service.
* `swagger-ui` & `swagger-ui-express`: API documentation.
* `zod`: Schema validation for inputs.

### Development

* TypeScript type definitions for libraries (`@types/*`).
* `ts-node-dev`: Run TypeScript with auto-reload.
* `typescript`: TypeScript compiler.

## Additional Notes

* The project includes AWS crypto libraries (`@aws-crypto/*`) in `node_modules`, suggesting potential use for secure data handling or encryption (e.g., SHA256 hashing). Ensure these are utilized if needed or remove them to reduce bundle size.
* If Stripe or PayPal SDKs are required, install `@stripe/stripe-js` or `paypal-rest-sdk` and configure them accordingly.
* The `keywords` field in `package.json` includes Arabic terms (e.g., "حجز", "مواعيد"), indicating the platform may support Arabic-speaking users.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Ensure code adheres to TypeScript standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the `package.json` for details.

## Keywords

booking, appointment, schedule, backend, nodejs, express, api, payment, stripe, paypal, reservation, user-auth, calendar, meeting, session, حجز, مواعيد, جلسات, نظام حجز

```

