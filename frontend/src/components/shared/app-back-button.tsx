'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IconArrowNarrowLeft } from '@tabler/icons-react';

export default function AppBackButton() {
  const router = useRouter();

  return (
    <Button
      className="cursor-pointer"
      size="icon"
      variant="ghost"
      onClick={() => router.back()}
    >
      <IconArrowNarrowLeft />
    </Button>
  );
}
