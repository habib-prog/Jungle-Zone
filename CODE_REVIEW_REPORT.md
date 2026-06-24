# JungleZone Code Review Report

Scope: login, registration, admin auth, Stripe, database interaction, and response safety.

## Executive Summary

The codebase has a few high-risk issues that can break authentication, leak secrets, or cause subscription records to become inconsistent.

The most important problems are:

1. Role naming is inconsistent across the app (`sitter`, `babysitter`, `babySitter`), which can break dashboard routing and Stripe subscription writes.
2. Babysitter registration returns the full saved Mongo document, which can expose the hashed password.
3. `AuthContext` references `/api/admin/profile`, but that route does not exist.
4. Stripe subscription flow has fragile model/role handling and a webhook persistence gap.

## Verified Findings

### 1) Babysitter registration returns the full saved object

- File: `app/api/babysitters/register/route.js`
- Current behavior: `savedData` is returned directly in the response.
- Risk: the response can include the password hash and other internal fields.
- Impact: unnecessary exposure of sensitive account data to the client.

### 2) Login role naming is inconsistent

- Files:
  - `app/api/login/route.js`
  - `middleware.js`
  - `app/(dashboard)/dashboard/page.jsx`
  - `app/api/payment/create-checkout-session/route.js`
- Current behavior: the code uses `sitter`, `babysitter`, and `babySitter` in different places.
- Risk: user routing, dashboard access, and Stripe subscription writes can target the wrong model or wrong path.
- Impact: login may succeed but downstream user lookups and redirects can fail.

### 3) Parent and babysitter registration only check duplicates inside their own collection

- Files:
  - `app/api/register/parent/route.js`
  - `app/api/babysitters/register/route.js`
  - `app/api/login/route.js`
- Current behavior: each registration route checks only its own model for duplicate email.
- Risk: the same email can exist in multiple collections.
- Impact: login can resolve the wrong account type and create token-role mismatches.

### 4) Admin profile route is missing

- File:
  - `app/context/AuthContext.jsx`
- Current behavior: `refreshUser()` calls `/api/admin/profile`.
- Verified repository state: there is no `app/api/admin/profile/route.js`.
- Impact: admin refresh flow cannot succeed and may throw or silently fail.

### 5) Stripe checkout session uses fragile role/model mapping

- File: `app/api/payment/create-checkout-session/route.js`
- Current behavior: `user.role === "babysitter"` is used to select the babysitter model, while the login token may contain `sitter`.
- Risk: the code can choose the wrong model or fail validation when creating payment records.
- Impact: checkout sessions can be created, but database writes can fail or point to the wrong user type.

### 6) Stripe webhook persistence is incomplete

- File: `app/api/webhooks/stripe/route.js`
- Current behavior: the webhook updates subscription and payment documents, but the flow depends on several fields being present and consistent.
- Risk: if key fields are missing or mismatched, later subscription deletion and invoice events may not find the correct document.
- Impact: subscription state can drift from Stripe state.

### 7) Login response shape is safe, but registration response is not

- File: `app/api/login/route.js`
- Good behavior: password is removed before returning the account object.
- Contrast: babysitter registration does not perform the same sanitization.
- Impact: the login endpoint is safer than the registration endpoint.

## Additional Notes

- The current code hashes passwords in the API routes, not in the schema. That is not automatically wrong, but it is less centralized than a schema hook or shared utility.
- The login route supports Google sign-in accounts by rejecting password login for those accounts, which is correct.
- `npm run lint` could not complete in this environment because the project is missing the `typescript` dependency required by the ESLint setup.

## Recommended Fix Order

1. Sanitize babysitter registration response before returning it.
2. Add `app/api/admin/profile/route.js` or remove the `refreshUser()` admin call.
3. Standardize role naming across login, middleware, dashboard, and Stripe.
4. Enforce email uniqueness across all user collections, not just per collection.
5. Re-check Stripe webhook and subscription write paths after role normalization.

## Short Conclusion

The app is close to workable, but the auth and billing layers are not yet fully aligned. Fixing the role naming and response sanitization should be the first priority because they affect login, dashboard access, and Stripe persistence at the same time.
