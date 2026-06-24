import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import BabySitterRegistration from "@/models/BabySitterRegistrationSchema";
import { normalizeRole } from "@/app/lib/roleUtils";
import GoogleProvider from "next-auth/providers/google";

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
                    const [existingParent, existingSitter] = await Promise.all([
                        parentSchema.findOne({ email: user.email }),
                        BabySitterRegistration.findOne({ email: user.email })
                    ]);

                    if (!existingParent && !existingSitter) {
                        await parentSchema.create({
                            fullName: user.name,
                            email: user.email,
                            picture: user.image,
                            password: "",
                            provider: "google",
                            role: "parent",
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
                const [dbParent, dbSitter] = await Promise.all([
                    parentSchema.findOne({ email: token.email }),
                    BabySitterRegistration.findOne({ email: token.email })
                ]);
                const dbUser = dbParent || dbSitter;
                token.role = normalizeRole(dbUser?.role || "parent");
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
