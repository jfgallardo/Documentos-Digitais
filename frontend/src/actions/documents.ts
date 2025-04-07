import { Document } from '@core';
import axios, { endpoints } from '@/utils/axios';

export const uploadDocument = async (formData: FormData): Promise<Document> => {
  try {
    const res = await axios.post(endpoints.documents.create, formData);

    return res.data;
  } catch (error) {
    console.error('Error upload document:', error);
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    const res = await axios.delete(endpoints.documents.delete(id));

    return res.data;
  } catch (error) {
    console.error('Error delete document:', error);
    throw error;
  }
};

export const downloadDocument = async (id: string): Promise<Blob> => {
  try {    
    const res = await axios.get(endpoints.documents.download(id), {
      responseType: 'blob',
    });
    
    return res.data;
  } catch (error) {
    console.error('Error download document:', error);
    throw error;
  }
};
