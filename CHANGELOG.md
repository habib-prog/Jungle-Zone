# Changelog

All notable changes to this project will be documented in this file.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`
- **MAJOR** — Breaking changes (API changes, data model restructuring)
- **MINOR** — New features (new endpoints, new UI pages, new integrations)
- **PATCH** — Bug fixes, small improvements, refactors

---

## [0.1.1] - 2025-06-25

### 🐛 Patch — Fix: Unified Authentication for API Endpoints

**Problem:** Profile picture upload and other API endpoints returned `401 Unauthorized` for users logged in via Google (NextAuth), because they only checked for the `token` cookie (set by email/password login) and ignored the NextAuth session.

**Solution:** Created a unified `getAuthenticatedUser()` helper that checks both authentication methods (token cookie + NextAuth session) and applied it across all affected API endpoints.

#### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `middleware/auth.js` | **Modified** | Added `getAuthenticatedUser()` helper — checks `token` cookie first, then falls back to NextAuth `getServerSession()` |
| `app/api/parent/picture/route.js` | **Modified** | Replaced manual token check with `getAuthenticatedUser()` |
| `app/api/babysitters/picture/route.js` | **Modified** | Replaced manual token check with `getAuthenticatedUser()` |
| `app/api/parent/profile/route.js` | **Modified** | Replaced custom `getAuthenticatedParent()` + `getUserId()` with shared `getAuthenticatedUser()` |
| `app/api/babysitters/profile/route.js` | **Modified** | Replaced custom `getUserId()` with `getAuthenticatedUser()` |
| `app/api/payment/create-checkout-session/route.js` | **Modified** | Replaced `getUserFromToken()` with `getAuthenticatedUser()` |
| `app/api/payment/verify-payment/route.js` | **Modified** | Replaced `getUserFromToken()` with `getAuthenticatedUser()` |

---

## [0.1.0] - Initial Release

### 🎉 Major — Initial Project Setup

- Next.js 16 project with App Router
- Google OAuth login via NextAuth
- Email/Password login with JWT token cookies
- Parent & Babysitter registration
- Profile management (GET/PATCH)
- Profile picture upload with Multer (local disk storage)
- Image serving via dynamic API route (`/api/profilePicture/[...filepath]`)
- Stripe payment integration (checkout sessions, webhooks, subscription management)
- Admin dashboard with approval workflows
- Role-based middleware routing (parent / babysitter / admin)
