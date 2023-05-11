import Pocketbase from "pocketbase";
import { CreateAppUserInput, User } from "@/api/types";

// TODO: FIX THIS
// const api = new Pocketbase(import.meta.env.VITE_API_URL);

const api = new Pocketbase("https://api.pachtop.com");

export const createAppUser = async (input: CreateAppUserInput) => {
  const appUser = await api.collection("app_users").create<User>(input); // Add type
  return appUser;
};
