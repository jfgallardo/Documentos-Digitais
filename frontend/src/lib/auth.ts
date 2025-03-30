import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from './schema';
import jwt from 'jsonwebtoken';
import axios, { endpoints } from '@/utils/axios';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (
        credentials,
      ): Promise<{ name: string; accessToken: string }> => {
        try {
          const validatedCredentials =
            await loginSchema.parseAsync(credentials);

          const response = await axios.post(
            endpoints.auth.signIn,
            validatedCredentials,
          );
          const { access_token } = response.data;

          return {
            name: validatedCredentials.email,
            accessToken: access_token,
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          throw new Error(e.message);
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        access_token: token.access_token,
      };
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === 'github') {
        return {
          ...token,
          access_token: jwt.sign(
            { id: profile?.id, email: profile?.email },
            process.env.AUTH_SECRET!,
            { expiresIn: '1h' },
          ),
        };
      }

      if (account?.provider === 'credentials') {
        token.access_token = (user as { accessToken: string }).accessToken;
      }

      return token;
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
