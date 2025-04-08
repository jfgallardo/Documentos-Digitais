import { deleteDocument } from '@/actions/documents';
import AppTooltip from '@/components/shared/app-tooltip';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  IconLoader3,
  IconMessageExclamation,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {
  onDelete: () => void;
  documentId: string;
};

export function DeleteDocument({ onDelete, documentId }: Props) {
  const t = useTranslations('DeleteDocument');
  const [loading, setLoading] = useState(false);

  return (
    <Dialog>
      <AppTooltip text={t('tooltip')}>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm' className='cursor-pointer'>
            <IconTrash />
          </Button>
        </DialogTrigger>
      </AppTooltip>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            <div className='flex items-center gap-1.5'>
              <IconMessageExclamation />
              <span>{t('warning')}</span>
            </div>
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground text-left'>
            {t('message')}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className='flex w-full justify-end gap-2'>
            <DialogClose asChild>
              <Button
                type='button'
                variant='default'
                className='cursor-pointer'
              >
                {t('button_cancel')}
              </Button>
            </DialogClose>
            <Button
              type='button'
              variant='outline'
              className='cursor-pointer'
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await deleteDocument(documentId);
                onDelete();
                setLoading(false);
              }}
            >
              {t('button_delete')}
              {loading && <IconLoader3 className='animate-spin' />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
