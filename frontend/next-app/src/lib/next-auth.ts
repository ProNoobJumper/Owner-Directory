import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.role = "user";
        token.provider = "google";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { role: string; provider: string }).role =
          (token.role as string) ?? "user";
        (session.user as typeof session.user & { role: string; provider: string }).provider =
          (token.provider as string) ?? "google";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
