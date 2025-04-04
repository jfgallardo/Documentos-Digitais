import { signIn } from '@/lib/auth';
import { Button } from '../ui/button';
import Github from '../ui/github';

export default function GithubSignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github');
      }}
    >
      <Button className='w-full' variant='outline'>
        <Github />
        Continue with GitHub
      </Button>
    </form>
  );
}
