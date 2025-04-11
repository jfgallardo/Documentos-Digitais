import NextAuth, { Session } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './schema';
import jwt from 'jsonwebtoken';
import axios, { endpoints } from '@/utils/axios';
import { JWT } from 'next-auth/jwt';

export interface ExtendedToken extends JWT {
  access_token: string;
  access_token_expires: number;
}

interface CustomSession extends Session {
  access_token?: string;
  access_token_expires?: number;
  email?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const response = await axios.post(endpoints.auth.signIn, {
            email,
            password,
          });
          const { access_token } = response.data;

          return {
            email,
            access_token,
          };
        } catch (e) {
          console.error('Error:', e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/error',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: CustomSession; token: JWT }) {
      session.access_token = token.accessToken as string;
      session.access_token_expires = Date.now() + 60 * 60 * 1000;
      session.email = token.email as string;
      return session;
    },
    async jwt({ token, account, profile, user }) {
      // TODO: Revisar si es necesario
      if (account && user) {
        if (account?.provider === 'github') {
          return {
            accessToken: jwt.sign(
              { id: profile?.id, email: profile?.email },
              process.env.AUTH_SECRET!,
              { expiresIn: '1h' },
            ),
            accessTokenExpires: Date.now() + 60 * 60 * 1000,
            email: profile?.email,
          };
        }

        if (account?.provider === 'credentials') {
          return {
            accessToken: (user as { access_token: string }).access_token,
            accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hora
            email: (user as { email: string }).email,
          };
        }
      }

      // Return existing token if still valid
      if (
        Date.now() < ((token as ExtendedToken).accessTokenExpires as number)
      ) {
        return token as ExtendedToken;
      }

      // Refresh token
      return await refreshAccessToken(token as ExtendedToken);
    },
    async signIn({ user, account }) {
      if (!user?.email) return false;
      try {
        const response = await axios.get(endpoints.users.getUsersByQuery, {
          params: { email: user.email },
        });

        if (response.data.length === 0) {
          await axios.post(endpoints.auth.signUp, {
            email: user.email,
            name: user.name || '',
            image: user.image || '',
            provider: account?.provider || 'github',
            password: user.email,
          });
        }
        return true;
      } catch (error) {
        console.error('Error al verificar o crear el usuario:', error);
        return false;
      }
    },
  },
});

const refreshAccessToken = async (
  token: ExtendedToken,
): Promise<ExtendedToken> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) throw new Error('Refresh failed');

    return {
      ...token,
      accessToken: data.accessToken,
      accessTokenExpires: Date.now() + 60 * 60 * 1000,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
};
