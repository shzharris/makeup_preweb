import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertMakeupUser, getMakeupUserIdByEmail, getMakeupUserIdByProviderSub, insertUsageLog } from "@/lib/db";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

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
        const email = user?.email?.trim().toLowerCase() ?? "";
        const provider = account?.provider ?? "google";
        const sub = account?.providerAccountId ?? undefined;

        const id = await upsertMakeupUser({
          loginEmail: email,
          nickname: user?.name ?? "",
          avatarUrl: user?.image ?? "",
          loginType: provider,
          oauthProvider: provider,
          oauthSub: sub ?? null,
        });

        const makeupUserId = id || (sub ? await getMakeupUserIdByProviderSub(provider, sub) : (email ? await getMakeupUserIdByEmail(email) : null));
        if (makeupUserId) {
          await insertUsageLog({ makeupUserId, action: "login", actionDataId: makeupUserId });
        }
        // 即便数据库写入失败，也不阻断登录
        return true;
      } catch (e) {
        console.error("[NextAuth][signIn][upsertMakeupUser]", e);
        // 不阻断登录，避免出现 AccessDenied
        return true;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name ?? token.name;
        // next-auth uses `picture` in token for image
        (token as JWT).picture = user?.image ?? (token as JWT).picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        type ExtendedUser = NonNullable<Session["user"]> & {
          id?: string | null;
          db_user_id?: string | null;
          avatar_url?: string | null;
        };
        const su = session.user as ExtendedUser;
        // id from token.sub (provider user id)
        su.id = token.sub ?? null;
        // inject db user id
        const email = session.user.email ?? "";
        const dbId = await getMakeupUserIdByEmail(email);
        if (dbId) su.db_user_id = dbId;
        // nickname from token.name
        session.user.name = (token.name as string | undefined) ?? session.user.name ?? "custom";
        // custom avatar_url field for client usage
        su.avatar_url = (token as JWT)?.picture ?? "";
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


