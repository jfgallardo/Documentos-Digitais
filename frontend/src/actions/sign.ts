import axios, { endpoints } from "@/utils/axios";
import { Signature } from "@core";

export const signDocument = async (
  formData: FormData,
  signatureId?: string
): Promise<Signature> => {
  try {
    let url = endpoints.signatures.create;

    if (signatureId) {
      url += `?signatureId=${signatureId}`;
    }

    const res = await axios.post(url, formData);

    console.log("res", res);

    return res.data;
  } catch (error) {
    console.error("Error upload document:", error);
    throw error;
  }
};

export const getSignaturesByOwner = async (owner: string) => {
  try {
    const res = await axios.get(endpoints.signatures.getByOwner(owner));

    return res.data;
  } catch (error) {
    console.error("Error get signatures:", error);
    throw error;
  }
};
