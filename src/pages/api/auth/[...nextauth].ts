import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? '',
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID ?? '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET ?? '',
      version: '2.0',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // TODO: check if user is moderated and return false if so
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.sub! } }
    },
  },
}

export default NextAuth(authOptions)
