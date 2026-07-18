const BRAND = "#629d2f";
const BRAND_DARK = "#4d7a24";
const SITE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://junglezone.uk";

const ADMIN_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL ||
  "https://junglezone.uk/dashboard/admin";

const wrap = (inner) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JungleZone</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6f1;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6f1;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
            ${inner}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const footer = `
  <tr>
    <td style="padding:20px 32px 32px;text-align:center;color:#9aa39a;font-size:12px;line-height:1.6;">
      JungleZone &mdash; safe, trusted childcare connections.<br/>
      &copy; ${new Date().getFullYear()} JungleZone. All rights reserved.
    </td>
  </tr>`;

export const otpEmail = ({ name = "there", otp = "", expiryMinutes = 10 }) => {
  const digits = otp
    .split("")
    .map(
      (d) =>
        `<span style="display:inline-block;min-width:38px;padding:10px 0;margin:0 4px;background:#ffffff;border:1px solid #e2ead9;border-radius:10px;font-size:24px;font-weight:700;color:${BRAND_DARK};letter-spacing:2px;">${d}</span>`,
    )
    .join("");

  const inner = `
    <tr>
      <td style="background:${BRAND};padding:22px 32px;border-radius:16px 16px 0 0;">
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">🌿 JungleZone</div>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:36px 32px 8px;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#1f2933;font-weight:700;">Confirm your email</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52606d;">
          Hi ${name}, thanks for joining JungleZone! Use the verification code below to activate your account.
        </p>
        <div style="text-align:center;margin:8px 0 24px;">${digits}</div>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#52606d;">
          This code expires in <strong>${expiryMinutes} minutes</strong>. If you didn't create a JungleZone account, you can safely ignore this email.
        </p>
      </td>
    </tr>
    ${footer}
  `;

  return wrap(inner);
};

export const verifiedEmail = ({ name = "there" }) => {
  const inner = `
    <tr>
      <td style="background:${BRAND};padding:22px 32px;border-radius:16px 16px 0 0;">
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">🌿 JungleZone</div>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:36px 32px 8px;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:#eaf5e1;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px;">✅</div>
        <h1 style="margin:0 0 8px;font-size:22px;color:#1f2933;font-weight:700;">You're all set!</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52606d;">
          Hi ${name}, your email has been verified. Welcome to the JungleZone family &mdash; you can now sign in and explore.
        </p>
        <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:10px;">Go to login</a>
      </td>
    </tr>
    ${footer}
  `;

  return wrap(inner);
};

export const sitterApprovedEmail = ({ name = "there" }) => {
  const inner = `
    <tr>
      <td style="background:${BRAND};padding:22px 32px;border-radius:16px 16px 0 0;">
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">🌿 JungleZone</div>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:36px 32px 8px;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:#eaf5e1;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px;">🎉</div>
        <h1 style="margin:0 0 8px;font-size:22px;color:#1f2933;font-weight:700;">You're approved!</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52606d;">
          Hi ${name}, great news! Your JungleZone babysitter account has been approved by our team.
          You can now sign in and start receiving bookings from parents.
        </p>
        <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:10px;">Go to login</a>
      </td>
    </tr>
    ${footer}
  `;

  return wrap(inner);
};

export const sitterRejectedEmail = ({ name = "there" }) => {
  const inner = `
    <tr>
      <td style="background:${BRAND};padding:22px 32px;border-radius:16px 16px 0 0;">
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">🌿 JungleZone</div>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:36px 32px 8px;text-align:center;">
        <div style="width:64px;height:64px;border-radius:50%;background:#fdeaea;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px;">⚠️</div>
        <h1 style="margin:0 0 8px;font-size:22px;color:#1f2933;font-weight:700;">Application not approved</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52606d;">
          Hi ${name}, unfortunately your JungleZone babysitter application could not be approved at this time.
          If you think this was a mistake, please contact our support team.
        </p>
        <a href="mailto:support@junglezone.co.uk" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:10px;">Contact support</a>
      </td>
    </tr>
    ${footer}
  `;

  return wrap(inner);
};

export const adminAddedEmail = ({ name = "Admin", email = "" }) => {
  const inner = `
    <tr>
      <td style="background:${BRAND};padding:22px 32px;border-radius:16px 16px 0 0;">
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">🌿 JungleZone</div>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:36px 32px 8px;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#1f2933;font-weight:700;">You've been added as an Admin</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#52606d;">
          Hi ${name}, an administrator has granted you <strong>admin access</strong> to JungleZone using the email <strong>${email}</strong>.
        </p>
        <div style="background:#f3f6f1;border:1px solid #e2ead9;border-radius:12px;padding:16px 18px;margin:0 0 20px;font-size:14px;color:#52606d;line-height:1.6;">
          You can now manage parents, babysitters, subscriptions, payments and more from the admin dashboard.
        </div>
        <a href="${ADMIN_DASHBOARD_URL}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:10px;">Open Admin Dashboard</a>
      </td>
    </tr>
    ${footer}
  `;

  return wrap(inner);
};
