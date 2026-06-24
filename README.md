## Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000

# Node Mailer
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Next Auth
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your_nextauth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Description

* `MONGODB_URI`
  MongoDB connection string used to connect the application to the database.

* `JWT_SECRET`
  Secret key used to sign and verify JWT tokens for authentication.

* `NEXT_PUBLIC_API_URL`
  Public URL of the API, accessible on the client side.

* `EMAIL_USER`
  Email address used for sending emails via Node Mailer.

* `EMAIL_PASS`
  App password for the email account used by Node Mailer.

* `NEXTAUTH_URL`
  Base URL of your application used by NextAuth.js.

* `AUTH_SECRET`
  Secret key used by NextAuth.js to encrypt tokens and session data.

* `AUTH_GOOGLE_ID`
  Google OAuth 2.0 client ID for NextAuth Google provider.

* `AUTH_GOOGLE_SECRET`
  Google OAuth 2.0 client secret for NextAuth Google provider.

* `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  Stripe publishable key, accessible on the client side for Stripe.js integration.

* `STRIPE_SECRET_KEY`
  Stripe secret key used for server-side API calls to Stripe.

* `STRIPE_WEBHOOK_SECRET`
  Secret used to verify Stripe webhook events.

Do not commit your `.env.local` file to version control.

---

## Setup Guide

### MongoDB Setup

1. Go to https://www.mongodb.com/
2. Create a new cluster or use an existing one
3. Click "Connect" and choose "Drivers"
4. Copy the connection string
5. Replace the password and database name placeholders
6. Paste it into `MONGODB_URI`

### NextAuth and Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable the Google+ API and configure OAuth consent screen
4. Create OAuth 2.0 Client ID credentials
5. Add your authorized redirect URIs (e.g. `https://your-domain.com/api/auth/callback/google`)
6. Copy the `Client ID` and `Client Secret`
7. Add them to `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
8. Set `NEXTAUTH_URL` to your application URL and generate a secure `AUTH_SECRET`

### Stripe Setup

1. Go to https://dashboard.stripe.com/test/apikeys (for test keys) or https://dashboard.stripe.com/apikeys (for live keys)
2. Copy your publishable key (`pk_test_...` or `pk_live_...`) and secret key (`sk_test_...` or `sk_live_...`)
3. Add them to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
4. Go to https://dashboard.stripe.com/webhooks and create a new endpoint
5. Copy the webhook secret and add it to `STRIPE_WEBHOOK_SECRET`

### Node Mailer Setup

1. Go to https://myaccount.google.com/apppasswords (for Gmail)
2. Enable 2-Step Verification if not already enabled
3. Generate an App Password for your application
4. Add your email to `EMAIL_USER` and the app password to `EMAIL_PASS`

### JWT Setup

1. Generate a strong random string for `JWT_SECRET`
2. Use a secure method such as `openssl rand -base64 32` to generate the secret
3. Add the generated value to `JWT_SECRET`

---

## Installation

```bash
npm install --legacy-peer-deps
```

## Usage

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Notes

* Stripe payment integration is configured using both test and live keys
* Google OAuth authentication is handled via NextAuth.js
* Image uploads may be handled through Cloudinary or similar services
* The application uploads images first, then stores the returned URL in the database
* Ensure all environment variables are correctly set before running the project
