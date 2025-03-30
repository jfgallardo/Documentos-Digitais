import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fDate } from '@/utils/format-time';
import { Signature } from '@core';
import { IconFileTypePdf } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { Document } from '@core';

type Props = {
  signatures: Signature[] | null;
};

interface SignatureDocument extends Signature {
  documents: Document[];
}
export default function ListSignatures({ signatures }: Props) {
  const t = useTranslations('ListSignatures');

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px]'>{t('headers.title')}</TableHead>
            <TableHead className='w-[100px] text-center'>
              {t('headers.signed_documents')}
            </TableHead>
            <TableHead className='w-[100px] text-right'>Url</TableHead>
            <TableHead className='w-[100px] text-right'>
              {t('headers.signed_at')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signatures?.length === 0 && (
            <TableRow className=''>
              <TableCell colSpan={6} align='center'>
                <span className='text-2xl'>{t('no_signatures')}</span>
              </TableCell>
            </TableRow>
          )}
          {signatures && (
            <>
              {signatures?.map((signature) => (
                <TableRow key={signature.id}>
                  <TableCell className='font-medium'>
                    {signature.name}
                  </TableCell>
                  <TableCell className='text-center  p-4 '>
                    {(signature as SignatureDocument).documents && (
                      <div className='space-y-2'>
                        {(signature as SignatureDocument).documents.map(
                          (doc) => (
                            <div
                              key={doc.id}
                              className='flex items-center justify-between p-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 transition'
                            >
                              <span className='text-sm font-semibold text-gray-800'>
                                {doc.title}
                              </span>
                              <IconFileTypePdf className='text-gray-600 ml-2' />{' '}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className='text-right'>
                    {signature.signatureUrl}
                  </TableCell>
                  <TableCell className='text-right'>
                    {fDate(signature.signedAt)}
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
