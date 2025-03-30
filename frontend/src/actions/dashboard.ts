import { Document } from "@core";
import axios, { endpoints } from "@/utils/axios";

export const getDocumentsByOwner = async (
  owner: string
): Promise<Document[]> => {
  try {
    const res = await axios.get(endpoints.documents.getByOwner(owner));

    return res.data;
  } catch (error) {
    console.error("Error get documents:", error);
    throw error;
  }
};
