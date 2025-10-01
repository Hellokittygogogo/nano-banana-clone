import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 首次登录时保存用户信息
      if (account && user) {
        token.accessToken = account.access_token
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      // 将token信息传递给session
      if (token) {
        session.accessToken = token.accessToken as string
        session.user.id = token.userId as string
      }
      return session
    },
    async signIn({ user, account }) {
      // 可以在这里添加用户白名单或其他验证逻辑
      if (account?.provider === 'google') {
        // 自动创建用户记录
        console.log('User signed in:', user.email)
        return true
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }