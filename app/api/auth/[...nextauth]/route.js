import { connectDB } from "@/config/db";
import parentSchema from "@/models/parentSchema";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    session: { strategy: "jwt", },

    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account.provider === "google") {
                    await connectDB();
                    const existing = await parentSchema.findOne({ email: user.email });
                    if (!existing) {
                        await parentSchema.create({
                            fullName: user.name,
                            email: user.email,
                            image: user.image,
                            password: "",
                            provider: "google",
                            role: "parent",
                        });
                    }
                }
            } catch (error) {
                console.error("Google save error:", err);
                return false;
            }
            return true;
        },

        // ADD THIS — puts role into the NextAuth JWT
        async jwt({ token, user, account }) {
            if (account && user) {
                await connectDB();
                const dbUser = await parentSchema.findOne({ email: token.email });
                token.role = dbUser?.role || "parent";
                token.id = dbUser?._id?.toString();
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };