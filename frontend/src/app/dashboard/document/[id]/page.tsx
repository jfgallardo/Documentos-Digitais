import AppBackButton from '@/components/shared/app-back-button';
import AppViewPdf from '@/components/shared/app-view-pdf';
import { auth } from '@/lib';
import { endpoints } from '@/utils/axios';

type Props = { params: Promise<{ id: string }> };

declare module 'next-auth' {
  interface Session {
    access_token?: string;
  }
}

async function ViewDocument({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const response = await fetch(
    `http://localhost:4000${endpoints.documents.download(id)}`,
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    },
  );

  const buffer = Buffer.from(await response.arrayBuffer());
  const base64 = buffer.toString('base64');
  const mimeType = 'application/pdf';
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return (
    <div className='flex flex-col items-start justify-start w-full h-full'>
      <div className='sticky top-0 z-10 bg-white p-2'>
        <AppBackButton />
      </div>

      <AppViewPdf path={dataUrl} />
    </div>
  );
}

export default ViewDocument;
