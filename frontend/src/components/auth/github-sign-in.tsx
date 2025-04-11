'use client';

import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import Github from '../ui/github';
import { useState } from 'react';
import { IconLoader3 } from '@tabler/icons-react';

export default function GithubSignIn() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className='w-full cursor-pointer'
      disabled={loading}
      variant='outline'
      onClick={() => {
        try {
          setLoading(true);
          signIn('github', { callbackUrl: '/dashboard', redirect: true });
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }}
    >
      <Github />
      Continue with GitHub
      {loading && <IconLoader3 className='animate-spin' />}
    </Button>
  );
}
