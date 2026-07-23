import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import adminSchema from "@/models/adminSchema";
import GoogleProvider from "next-auth/providers/google";
import { resolveAuthAccount } from "@/app/lib/authAccountResolver";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account.provider === "google") {
          await connectDB();
          const [existingParent, existingSitter, existingAdmin] =
            await Promise.all([
              parentSchema.findOne({ email: user.email }),
              BabySitterRegistration.findOne({ email: user.email }),
              adminSchema.findOne({ email: user.email }),
            ]);

          // If there's already an admin account with this email, allow sign-in
          if (!existingParent && !existingSitter && !existingAdmin) {
            await parentSchema.create({
              fullName: user.name,
              email: user.email,
              picture: user.image,
              password: "",
              provider: "google",
              role: "parent",
              subscription: "free",
              subscriptionStart: null,
              subscriptionExpiry: null,
            });
          }
        }
      } catch (error) {
        console.error("NextAuth signIn callback error:", error);
        return false;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        await connectDB();
        const [dbParent, dbSitter, dbAdmin] = await Promise.all([
          parentSchema.findOne({ email: token.email }),
          BabySitterRegistration.findOne({ email: token.email }),
          adminSchema.findOne({ email: token.email }),
        ]);
        const { account: dbUser, role } = resolveAuthAccount({
          parent: dbParent,
          sitter: dbSitter,
          admin: dbAdmin,
          email: token.email,
        });
        token.role = role;
        token.id = dbUser?._id?.toString();
        token.name = dbUser?.fullName || token.name || user.name;
        token.picture = dbUser?.picture || token.picture || user.image;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.name = token.name || session.user.name;
      session.user.email = token.email || session.user.email;
      session.user.image = token.picture || session.user.image;
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
