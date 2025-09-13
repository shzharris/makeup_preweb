import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertMakeupUser, getMakeupUserIdByEmail, insertUsageLog } from "@/lib/db";

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
        const id = await upsertMakeupUser({
          loginEmail: email,
          nickname: user?.name ?? "",
          avatarUrl: (user as any)?.image ?? "",
          loginType: account?.provider ?? "google",
        });
        if (id) {
          await insertUsageLog({ makeupUserId: id, action: "login", actionDataId: id });
        } else {
          const existingId = await getMakeupUserIdByEmail(email);
          if (existingId) {
            await insertUsageLog({ makeupUserId: existingId, action: "login", actionDataId: existingId });
          }
        }
        return true;
      } catch (e) {
        console.error("[NextAuth][signIn][upsertMakeupUser]", e);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name ?? token.name;
        // next-auth uses `picture` in token for image
        (token as any).picture = (user as any)?.image ?? (token as any).picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // id from token.sub (provider user id)
        (session.user as any).id = token.sub;
        // inject db user id
        const email = session.user.email ?? "";
        const dbId = await getMakeupUserIdByEmail(email);
        if (dbId) (session.user as any).db_user_id = dbId;
        // nickname from token.name
        session.user.name = (token.name as string | undefined) ?? session.user.name ?? "custom";
        // custom avatar_url field for client usage
        (session.user as any).avatar_url = (token as any)?.picture ?? "";
      }
      return session;
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


