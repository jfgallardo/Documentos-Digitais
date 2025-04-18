import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SignDocument } from './sign-document';
import { Document } from '@core';
import { Button } from '@/components/ui/button';
import { IconDownload, IconEye, IconFileTypePdf } from '@tabler/icons-react';
import { fDate } from '@/utils/format-time';
import { Badge } from '@/components/ui/badge';
import { downloadDocument } from '@/actions/documents';
import { DeleteDocument } from './delete-document';
import { useTranslations } from 'next-intl';
import AppTooltip from '@/components/shared/app-tooltip';
import { useRouter } from 'next/navigation';

type Props = {
  documents: Document[] | null;
  onReset: () => void;
};

export default function ListDocuments({ documents, onReset }: Props) {
  const t = useTranslations('ListDocuments');
  const router = useRouter();

  const handleDownload = async (id: string) => {
    const response = await downloadDocument(id);
    const url = window.URL.createObjectURL(new Blob([response]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento-${id}.pdf`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleView = async (id: string) => {
    router.push(`/dashboard/document/${id}`);
  };

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px]'>{t('headers.title')}</TableHead>
            <TableHead className='w-[100px] text-center'>
              {t('headers.status')}
            </TableHead>
            <TableHead className='w-[100px] text-right'>
              {t('headers.created')}
            </TableHead>
            <TableHead className='w-[100px] text-right'>
              {t('headers.updated')}
            </TableHead>
            <TableHead className='w-[200px] text-center'>
              {t('headers.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents?.length === 0 && (
            <TableRow className=''>
              <TableCell colSpan={6} align='center'>
                <span className='text-2xl'>{t('no_documents')}</span>
              </TableCell>
            </TableRow>
          )}
          {documents && (
            <>
              {documents?.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className='font-medium flex items-center justify-start gap-2.5'>
                    <IconFileTypePdf />
                    {document.title}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge
                      variant={
                        document.status === 'pending' ? 'secondary' : 'default'
                      }
                    >
                      {document.status === 'pending'
                        ? t('status.pending')
                        : t('status.signed')}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    {fDate(document.createdAt)}
                  </TableCell>
                  <TableCell className='text-right'>
                    {fDate(document.updatedAt)}
                  </TableCell>
                  <TableCell className='flex gap-2 items-end justify-end'>
                    <DeleteDocument
                      documentId={document.id}
                      onDelete={() => {
                        onReset();
                      }}
                    />
                    {document.status === 'pending' && (
                      <SignDocument
                        document={document}
                        onSign={() => {
                          onReset();
                        }}
                      />
                    )}
                    <AppTooltip text={t('tooltip')}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='cursor-pointer'
                        onClick={() => handleDownload(document.id)}
                      >
                        <IconDownload />
                      </Button>
                    </AppTooltip>
                    <AppTooltip text={t('tooltip-eye')}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='cursor-pointer'
                        onClick={() => handleView(document.id)}
                      >
                        <IconEye />
                      </Button>
                    </AppTooltip>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
