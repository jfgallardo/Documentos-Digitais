'use client';
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
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { uploadDocument } from '@/actions/documents';
import { useTranslations } from 'next-intl';
import { IconLoader3, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
  ownerId: string;
  onUpload: () => void;
};

export function CreateDocument({ ownerId, onUpload }: Props) {
  const t = useTranslations('CreateDocument');
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    file: z.custom<File | string | null>().transform((data, ctx) => {
      const hasFile =
        data instanceof File || (typeof data === 'string' && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File is required!',
        });
        return null;
      }

      return data;
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  const { setValue } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const formData = new FormData();
      const file: File = values.file as File;

      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('status', 'pending');
      formData.append('ownerId', ownerId);

      await uploadDocument(formData);
      onUpload();
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setValue('file', file, { shouldValidate: true });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' size={'sm'} className='cursor-pointer'>
          <span className='flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
            <span className='ml-2'>{t('title')}</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem>
                  <FormLabel>{t('file')}</FormLabel>
                  <FormControl>
                    <Input
                      id='file'
                      type='file'
                      accept='.pdf'
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className='flex w-full justify-end gap-2'>
                <DialogClose asChild>
                  <Button type='button' variant='default'>
                    {t('button_close')}
                  </Button>
                </DialogClose>
                <Button
                  type='submit'
                  variant='outline'
                  className='cursor-pointer'
                  disabled={loading}
                >
                  {t('button_upload')}
                  {loading ? (
                    <IconLoader3 className='animate-spin' />
                  ) : (
                    <IconUpload />
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
