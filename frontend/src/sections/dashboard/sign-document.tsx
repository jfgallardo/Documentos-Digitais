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
import { IconEraser, IconScan, IconSignature } from '@tabler/icons-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Document } from '@core';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { signDocument } from '@/actions/sign';
import { useAuthContext } from '@/auth/hooks';
import { useSignaturesContext } from '../signatures/hook/use-signatures-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';

type Props = {
  onSign: () => void;
  document: Document;
};

enum SignType {
  sign = 'sign',
  file = 'file',
}

export function SignDocument({ onSign, document }: Props) {
  const { user } = useAuthContext();
  const { signatures, getSignatures } = useSignaturesContext();
  const t = useTranslations('SignDocument');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleInit = async () => {
      try {
        await getSignatures?.(document.ownerId);
      } catch (e) {
        console.error(e);
      }
    };
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [preview, setPreview] = useState<string | null>(null);
  const formSchema = z
    .object({
      file: z.custom<File | string | null>().transform((data) => {
        const hasFile =
          data instanceof File || (typeof data === 'string' && !!data.length);

        if (!hasFile) {
          return null;
        }

        return data;
      }),
      sign: z.string().optional(),
    })
    .refine(
      (data) => {
        const hasFile = !!data.file;
        const hasSign = !!data.sign?.length;
        return hasFile !== hasSign;
      },
      {
        message: t('message_validation'),
        path: ['file'],
      },
    );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
      sign: '',
    },
  });

  const { setValue } = form;

  const fileValue = form.watch('file');
  const signValue = form.watch('sign');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    const file: File = values.file as File;

    formData.append('file', file);
    formData.append('documentId', document.id);
    formData.append('signerId', user?.id as string);

    await signDocument(formData, values.sign ? values.sign : undefined);
    onSign();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPreview(URL.createObjectURL(file as File));
    setValue('file', file, { shouldValidate: true });
  };

  const onReset = (item: SignType) => {
    setValue(item, '', { shouldValidate: true });
    setPreview(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='cursor-pointer'>
          <IconSignature />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {!signValue && (
              <FormField
                control={form.control}
                name='file'
                render={({ field }) => (
                  <div className='flex items-center justify-between gap-2'>
                    <FormItem>
                      <FormControl>
                        <div>
                          <Input
                            ref={fileInputRef}
                            key={
                              field.value
                                ? 'file-with-value'
                                : 'file-without-value'
                            }
                            id='file'
                            type='file'
                            accept='.jpg,.jpeg,.png'
                            onChange={handleFileChange}
                            className='hidden'
                          />
                          <Button onClick={handleButtonClick} type='button'>
                            <IconScan />
                            {t('file')}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    {field.value && (
                      <IconEraser
                        className='cursor-pointer'
                        onClick={() => onReset(field.name as SignType)}
                      />
                    )}
                  </div>
                )}
              />
            )}

            {!fileValue && (
              <>
                {signatures && signatures?.length > 0 && (
                  <div>
                    <FormField
                      control={form.control}
                      name='sign'
                      render={({ field }) => (
                        <div className='flex gap-2'>
                          <FormItem>
                            <FormLabel>{t('register_signature')}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t('placeholder_select')}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {signatures.map((signature) => (
                                  <SelectItem
                                    key={signature.id}
                                    value={signature.id}
                                  >
                                    {signature.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {t('description_signature')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                          {field.value && (
                            <IconEraser
                              className='cursor-pointer'
                              onClick={() => onReset(field.name as SignType)}
                            />
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}
              </>
            )}

            {preview && (
              <div className='flex items-center justify-center border rounded-lg p-2 bg-white shadow-lg'>
                <Image src={preview} alt='Preview' width={220} height={220} />
              </div>
            )}

            <DialogFooter>
              <div className='flex w-full justify-end gap-2'>
                <DialogClose asChild>
                  <Button type='button' variant='default'>
                    {t('button_close')}
                  </Button>
                </DialogClose>
                <Button type='submit' variant='outline'>
                  {t('button_sign')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
