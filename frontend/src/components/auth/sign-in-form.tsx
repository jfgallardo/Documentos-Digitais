'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/lib';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconLoader3, IconSquareRoundedX } from '@tabler/icons-react';
import GithubSignIn from './github-sign-in';

enum Error {
  Configuration = 'Configuration',
  CredentialsSignin = 'CredentialsSignin',
}

const errorMap = {
  [Error.CredentialsSignin]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{' '}
      <code className='rounded-sm bg-slate-100 p-1 text-xs'>
        CredentialsSignin
      </code>
    </p>
  ),
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{' '}
      <code className='rounded-sm bg-slate-100 p-1 text-xs'>Configuration</code>
    </p>
  ),
};

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const error = search.get('error') as Error;
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setLoading(true);
    signIn('credentials', data, { redirectTo: '/dashboard' });
  };

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
        {error && errorMap[error] && (
          <div className='flex w-full flex-col items-center justify-center relative'>
            <IconSquareRoundedX
              className='absolute right-2 top-2 cursor-pointer hover:text-red-500'
              onClick={() => router.push('/sign-in')}
            />
            <div className='block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
              <h5 className='mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                Something went wrong
              </h5>
              <div className='font-normal text-gray-700 dark:text-gray-400'>
                {errorMap[error] || 'Please contact us if this error persists.'}
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='johndoe@email.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='******' type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className='w-full cursor-pointer'
              type='submit'
              disabled={loading}
            >
              Sign In {loading && <IconLoader3 className='animate-spin' />}
            </Button>
          </form>
        </Form>

        <div className='text-center'>
          <Button asChild variant='link'>
            <Link href='/sign-up'>Don&apos;t have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
