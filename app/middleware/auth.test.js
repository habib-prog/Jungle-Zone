import test from "node:test";
import assert from "node:assert/strict";

test("verifies tokens signed with AUTH_SECRET when JWT_SECRET is unavailable", async () => {
  process.env.JWT_SECRET = "";
  process.env.AUTH_SECRET = "fallback-secret";
  const { signToken, verifyToken } = await import("../../middleware/auth.js");

  const token = signToken({
    id: "user-123",
    email: "user@example.com",
    role: "parent",
  });
  const decoded = verifyToken(token);

  assert.equal(decoded.id, "user-123");
  assert.equal(decoded.email, "user@example.com");
});
