import { deleteDocument } from '@/actions/documents';
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
import { IconMessageExclamation, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

type Props = {
  onDelete: () => void;
  documentId: string;
};

export function DeleteDocument({ onDelete, documentId }: Props) {
  const t = useTranslations('DeleteDocument');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='cursor-pointer'>
          <IconTrash />
        </Button>
      </DialogTrigger>
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
              <Button type='button' variant='default'>
                {t('button_cancel')}
              </Button>
            </DialogClose>
            <Button
              type='button'
              variant='outline'
              onClick={async () => {
                await deleteDocument(documentId);
                onDelete();
              }}
            >
              {t('button_delete')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
