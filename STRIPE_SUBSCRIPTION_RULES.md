# Stripe Subscription & Free Trial Rules

This document outlines the rules, integration flows, and business logic implemented for the subscription and free trial systems in Jungle Zone.

---

## 1. Free Trial Allocations
When a new user registers or signs up via Google OAuth, they automatically receive a free trial:
* **Parents:** 1 Month Free Trial (`subscription: "trial"`).
* **Babysitters:** 2 Months Free Trial (`subscription: "trial"`).

---

## 2. Dynamic Pricing & Auto-Billing
The platform offers two pricing tiers for active plans:
* **Monthly:** £2.99 / month
* **Yearly:** £26.91 / year (25% off)

### How Auto-Billing Works:
* If a user initiates a checkout during their free trial, the remaining trial days are calculated and passed directly to Stripe via `trial_period_days`.
* The user pays **£0.00 today** (Stripe creates a trial subscription).
* If the user **does not cancel** before the trial days expire, Stripe automatically bills their card £2.99/month or £26.91/year depending on their choice.
* If a user has already used or completed their trial, they do not receive trial days and are billed immediately.

---

## 3. UI Display & Banner Logic (`/pricing`)

### Banners:
* **Trial Running Banner:** Logged-in users with a running trial see a notification banner detailing their trial expiry date and future billing values.
* **Active Subscription Banner:** Users with an active paid plan see their billing cycle and next renewal date.

### Cards & Badges:
* Users who are logged out, or logged in and eligible for a trial, will see a badge under the price:
  * **Parent view:** `Includes 1 Month Free Trial`
  * **Babysitter view:** `Includes 2 Months Free Trial`

### Dynamic Button States (Idle status):
* **Not Logged In:** Button shows `Start [1-Month / 2-Month] Free Trial` (Redirects to login/signup).
* **Trial Active:** Button shows `Trial Running ([X] Days Left)` (Allows them to subscribe early to transition automatically).
* **Trial Expired:** Button shows `Choose Monthly` / `Choose Yearly` (Regular immediate billing).

---

## 4. Safe Plan Switching & Cancellation
To protect users from losing their plan due to payment failures, we enforce a strict transaction sequence:
1. When switching plans, the previous subscription **is NOT cancelled** beforehand.
2. The user goes through the new checkout session.
3. Only when Stripe confirms payment success (`invoice.payment_succeeded` webhook or Success page verification), the system automatically cancels the old subscription and activates the new one.

---

## 5. Admin Dashboard Payment Tracking
The admin dashboard contains a dedicated **"Payments"** tab (`/dashboard/admin`) connected directly to the database:
* **Summary Cards:** Displays Total Payments, Completed Payments count, Pending Payments count, and Total Revenue.
* **Filter Options:** Search by plan, category, session ID, or filter by payment status (All, Completed, Pending, Failed, Cancelled, Refunded).
* **Payment Record Table:** Lists transaction time, plan name, user category, exact amount paid, billing cycle, transaction status, and Stripe Session ID.
