# 🌴 Jungle Zone — Babysitting Service Platform

> A full-stack babysitting service marketplace built with **Next.js 16**, **MongoDB**, and **Stripe**, connecting parents with verified babysitters in the UK.

---

## 🛠️ Maintenance Notice

> **This project is currently maintained by [Habib](https://github.com/habib-prog).**
>
> I have taken over the maintenance responsibility of this project. All ongoing bug fixes, feature additions, security patches, and code improvements are handled by me. For any issues, suggestions, or contributions, please open an issue or contact me directly.
>
> _Maintenance started: June 22 / 2026_

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Email/Password Login** — JWT-based authentication with secure httpOnly cookie storage
- **Google OAuth Login** — Seamless Google sign-in via NextAuth.js
- **Role-Based Access Control** — Three distinct roles: `Parent`, `Babysitter`, `Admin`
- **Protected Routes** — Middleware-based route guarding with automatic role redirection
- **Unified Auth System** — Supports both login methods across all API endpoints

### 👨‍👩‍👧 Parent Features
- Register & manage parent profile
- Upload & update profile picture
- Search and browse verified babysitters
- View detailed babysitter profiles
- Subscribe to premium plans via Stripe
- Contact support

### 👶 Babysitter Features
- Multi-step registration with verification documents
- Profile management (skills, languages, certifications, availability, hourly rate, etc.)
- Profile picture upload & update
- Subscription plans for enhanced visibility
- Dashboard with profile overview

### 🛡️ Admin Dashboard
- **Overview** — Platform statistics and analytics
- **All Parents** — View, manage, and moderate parent accounts
- **All Babysitters** — View, approve/reject babysitter registrations
- **Babysitter Approval** — Verification workflow for new babysitter sign-ups
- **Subscription Plans** — Create, edit, activate/deactivate subscription plans
- **Payments** — View and track all payment records
- **Contact Messages** — View messages submitted through the contact form

### 💳 Stripe Payment Integration
- Subscription-based pricing (Monthly & Yearly billing cycles)
- Stripe Checkout Sessions for secure payments
- Webhook handling for real-time payment event processing
- Payment verification and subscription fulfillment
- Automatic Stripe product & price creation

### 📸 Image Upload System
- Profile picture upload using **Multer** (local disk storage)
- Supports `JPG`, `PNG`, `WEBP` formats (max 3MB)
- Dynamic image serving via API route (`/api/profilePicture/[...filepath]`)
- Automatic cleanup of old profile pictures on update

### 📧 Email Notifications
- Contact form email delivery via **Nodemailer** (Gmail SMTP)

### 🎨 UI/UX
- Responsive design with **Tailwind CSS v4**
- Smooth animations with **GSAP** and **AOS**
- Component library with **Ant Design (antd)**
- Icon sets: **React Icons** & **Lucide React**
- Charts & analytics with **Recharts**
- Toast notifications with **React Toastify** & **Sonner**

### 📄 Static Pages
- Homepage with hero section, testimonials, safety info
- About Us
- Pricing page
- Contact page
- Privacy Policy
- Terms & Conditions
- Terms of Service
- Cookies Policy

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Frontend** | React 19, Tailwind CSS v4, Ant Design, GSAP, AOS |
| **Backend** | Next.js API Routes (Node.js runtime) |
| **Database** | MongoDB with Mongoose |
| **Authentication** | NextAuth.js (Google OAuth) + JWT (Email/Password) |
| **Payments** | Stripe (Checkout, Subscriptions, Webhooks) |
| **File Upload** | Multer (local disk storage) |
| **Email** | Nodemailer (Gmail SMTP) |

---

## 📁 Project Structure

```
jungleZone/
├── app/
│   ├── (baby-sitting)/          # Public-facing pages
│   │   ├── about-us/
│   │   ├── babysitters/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── pricing/
│   │   ├── privacy-policy/
│   │   ├── terms-conditions/
│   │   └── ...
│   ├── (dashboard)/             # Protected dashboard pages
│   │   └── dashboard/
│   │       ├── admin/
│   │       ├── babySitter/
│   │       └── parent/
│   ├── api/                     # API Routes
│   │   ├── admin/               # Admin endpoints
│   │   ├── auth/                # NextAuth config
│   │   ├── babysitters/         # Babysitter CRUD + picture
│   │   ├── contact/             # Contact form
│   │   ├── login/               # Email/password login
│   │   ├── logout/              # Logout
│   │   ├── parent/              # Parent CRUD + picture
│   │   ├── payment/             # Stripe checkout & verification
│   │   ├── profilePicture/      # Image serving
│   │   ├── register/            # Registration
│   │   └── webhooks/            # Stripe webhooks
│   ├── components/              # React components
│   │   ├── AdminDashboard/
│   │   ├── BabySitterDashboard/
│   │   ├── ParentDashboard/
│   │   ├── Home/
│   │   ├── common/              # Navbar, Footer, etc.
│   │   └── register-babysitter/
│   ├── context/                 # React Context providers
│   └── lib/                     # Utilities (multer, stripe, roles, etc.)
├── config/                      # DB & Stripe config
├── middleware/                   # Auth & multer middleware
├── middleware.js                 # Next.js route middleware
├── models/                      # Mongoose schemas
├── profilePicture/              # Uploaded images (local storage)
└── public/                      # Static assets
```

---

## ⚙️ Environment Setup

This project depends on environment-specific secrets and service credentials. Configure them in your local runtime or deployment platform as needed.

---

## 🚀 Getting Started

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed version history of all changes.

---

## 📜 License

This project is private and not open for public distribution.
