'use client';
import { useEffect } from 'react';
import { useSignaturesContext } from '../hook/use-signatures-context';
import LoadingScreen from '@/components/loading-screen/loading-screen';
import { useAuthContext } from '@/auth/hooks';
import ListSignatures from '../list-signatures';
import { useTranslations } from 'next-intl';
import { IconHelp } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SignaturesView() {
  const { signatures, loadingSignatures, getSignatures } =
    useSignaturesContext();
  const { user, checkUserSession } = useAuthContext();

  const t = useTranslations('SignaturesView');

  useEffect(() => {
    const handleInit = async () => {
      try {
        await checkUserSession();
      } catch (e) {
        console.error(e);
      }
    };
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleInit = async (id: string) => {
      try {
        await getSignatures?.(id);
      } catch (e) {
        console.error(e);
      }
    };
    if (user?.id) {
      handleInit(user?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loadingSignatures) {
    return <LoadingScreen text='Preparando firmas...' />;
  }

  return (
    <>
      <div className='flex flex-col space-y-2 xl:flex-row xl:justify-around items-center mb-7 w-full'>
        <h1 className='text-xl sm:text-3xl font-bold px-1.5'>{t('title')}</h1>

        <Alert className='max-w-md'>
          <IconHelp className='h-4 w-4' />
          <AlertTitle>{t('title_alert')}</AlertTitle>
          <AlertDescription>{t('title_description')}</AlertDescription>
        </Alert>
      </div>
      {user?.id && <ListSignatures signatures={signatures} />}
    </>
  );
}
