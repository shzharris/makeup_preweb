import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertMakeupUser } from "@/lib/db";

export const runtime = "nodejs";

// NextAuth configuration with Google provider
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          // Request offline access to receive refresh tokens if needed
          access_type: "offline",
          prompt: "consent",
        },
      },
      wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
      // Increase openid-client outgoing request timeout (default ~3500ms)
      httpOptions: {
        timeout: Number(process.env.OAUTH_TIMEOUT_MS ?? 15000),
      },
    }),
  ],
  // Explicitly set the Google callback path as requested
  callbacks: {
    async signIn({ user, account }) {
      try {
        const email = user?.email ?? "";
        await upsertMakeupUser({
          loginEmail: email,
          nickname: user?.name ?? "",
          avatarUrl: (user as any)?.image ?? "",
          loginType: account?.provider ?? "google",
        });
        return true;
      } catch (e) {
        console.error("[NextAuth][signIn][upsertMakeupUser]", e);
        return false;
      }
    },
  },
  pages: {},
  // Set secret and optionally enable debug via env vars
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === "true",
  // NextAuth will handle the callback at /api/auth/callback/google automatically
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


