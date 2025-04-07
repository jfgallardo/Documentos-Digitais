'use client';

import React from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { signUpSchema } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '@/actions/auth';
import { User } from '@core';
import { redirect } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';

function SignUpForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await signUp(values as User);
    redirect('/sign-in');
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-sm mx-auto space-y-6 bg-white p-6 rounded-lg shadow-md'>
        <div className='w-full max-w-sm mx-auto space-y-6'>
          <h1 className='text-2xl font-bold text-center mb-6'>
            Create Account
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} type='text' />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email' {...field} type='email' />
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
                      <Input
                        type='password'
                        placeholder='Password'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      La contraseña debe tener entre 8 y 32 caracteres y puede
                      incluir letras, números y caracteres especiales.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className='w-full cursor-pointer' type='submit'>
                Sign Up
              </Button>
            </form>
          </Form>

          <div className='text-center'>
            <Button asChild variant='link' >
              <Link href='/sign-in'>Already have an account? Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
