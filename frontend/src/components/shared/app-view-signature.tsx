import { endpoints } from '@/utils/axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type Props = {
  idSignature: string;
  className?: string;
};

function AppViewSignature({ idSignature, className }: Props) {
  const [base64, setBase64] = useState<string>(
    'https://sb.kaleidousercontent.com/67418/1920x1100/db73e683cd/full.png',
  );
  const { data: session } = useSession();

  useEffect(() => {
    const handleInit = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000${endpoints.signatures.download(idSignature)}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          },
        );
        const contentType = response.headers.get('Content-Type');
        const buffer = Buffer.from(await response.arrayBuffer());
        const base64 = buffer.toString('base64');
        setBase64(`data:${contentType};base64,${base64}`);
      } catch (e) {
        console.error(e);
      }
    };
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Image
        src={base64}
        alt='Preview'
        width={220}
        height={220}
        className={className}
      />
    </div>
  );
}

export default AppViewSignature;
