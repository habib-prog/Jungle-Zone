import Parent from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import Subscription from "@/models/subscriptionSchema";
import { normalizeRole } from "@/app/lib/roleUtils";

const ACTIVE_PAYMENT_STATUSES = ["active", "cancelled"];

const isFutureDate = (value, now = new Date()) => {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date > now;
};

export const hasUsableAccountSubscription = (account, now = new Date()) => {
  if (!account) return false;

  const subscription = String(account.subscription || "").toLowerCase();
  if (!subscription || subscription === "free") return false;

  return isFutureDate(account.subscriptionExpiry, now);
};

const getModelByRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "parent") return Parent;
  if (normalizedRole === "babysitter") return BabySitterRegistration;
  return null;
};

export const getAccountForAuthUser = async (auth) => {
  if (!auth) return null;

  const role = normalizeRole(auth.role);
  const Model = getModelByRole(role);
  if (!Model) return null;

  if (auth.id) {
    const account = await Model.findById(auth.id);
    if (account) return account;
  }

  if (auth.email) {
    return Model.findOne({ email: auth.email });
  }

  return null;
};

export const hasUsablePaidSubscription = async (auth, now = new Date()) => {
  if (!auth?.id) return false;

  const activeSubscription = await Subscription.exists({
    userId: auth.id,
    category: normalizeRole(auth.role),
    isActive: true,
    paymentStatus: { $in: ACTIVE_PAYMENT_STATUSES },
    endDate: { $gt: now },
  });

  return Boolean(activeSubscription);
};

export const getFacilityAccessForUser = async (auth, options = {}) => {
  const { allowedRoles = ["parent", "babysitter"] } = options;
  const role = normalizeRole(auth?.role);

  if (!auth) {
    return {
      isLoggedIn: false,
      role: null,
      hasActiveSubscription: false,
      canUseFacilities: false,
      reason: "unauthorized",
    };
  }

  if (!allowedRoles.includes(role)) {
    return {
      isLoggedIn: true,
      role,
      hasActiveSubscription: false,
      canUseFacilities: false,
      reason: "invalid_role",
    };
  }

  const now = new Date();
  const account = await getAccountForAuthUser({ ...auth, role });
  const hasActiveSubscription =
    hasUsableAccountSubscription(account, now) ||
    (await hasUsablePaidSubscription({ ...auth, role }, now));

  return {
    isLoggedIn: true,
    role,
    hasActiveSubscription,
    canUseFacilities: hasActiveSubscription,
    reason: hasActiveSubscription ? "active" : "subscription_required",
  };
};
