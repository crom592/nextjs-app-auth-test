import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

export default NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // 로그인 시 사용자의 SNS 정보를 Django로 전송합니다.
      const res = await fetch(`${process.env.DJANGO_API_URL}/api/sns-user/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.API_KEY,
        },
        body: JSON.stringify({
          sns_id: account.providerAccountId,
          sns_type: account.provider,
          email: user.email,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        user.jwt = data.jwt;
        return true;
      } else {
        console.error(data.error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      session.jwt = token.jwt;
      return session;
    },
  },
});
