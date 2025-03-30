import GithubSignIn from '@/components/auth/github-sign-in';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, signIn } from '@/lib/auth';
import { executeAction } from '@/lib/executeAction';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-sm mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center mb-6'>Sign In</h1>
        <GithubSignIn />
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with email
            </span>
          </div>
        </div>

        <form
          className='space-y-4'
          action={async (formData) => {
            'use server';
            await executeAction({
              actionFn: async () => {
                await signIn('credentials', formData);
              },
            });
          }}
        >
          <Input
            name='email'
            placeholder='Email'
            type='email'
            required
            autoComplete='email'
          />
          <Input
            name='password'
            placeholder='Password'
            type='password'
            required
            autoComplete='current-password'
          />
          <Button className='w-full' type='submit'>
            Sign In
          </Button>
        </form>

        <div className='text-center'>
          <Button asChild variant='link'>
            <Link href='/sign-up'>Don&apos;t have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
