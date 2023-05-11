import Pocketbase from "pocketbase";
import { CreateAppUserInput, User } from "@/api/types";

const api = new Pocketbase(import.meta.env.VITE_API_URL);

export const createAppUser = async (input: CreateAppUserInput) => {
  const appUser = await api.collection("app_users").create<User>(input); // Add type
  return appUser;
};