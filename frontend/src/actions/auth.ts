import { ResponseSession } from "@/auth/types";
import axios, { endpoints } from "@/utils/axios";
import { User } from "@core";

export const signUp = async (body: User): Promise<{ message: string }> => {
  try {
    const res = await axios.post(endpoints.auth.signUp, body);

    return res.data;
  } catch (error) {
    console.error("Error sign up:", error);
    throw error;
  }
};

export const getProfile = async (): Promise<ResponseSession> => {
  try {
    const res = await axios.get(endpoints.auth.me);

    return res.data;
  } catch (error) {
    console.error("Error get profile:", error);
    throw error;
  }
};
