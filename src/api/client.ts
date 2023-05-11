import Pocketbase from "pocketbase";
import { CreateAppUserInput } from "@/api/types";

console.log(import.meta.env.VITE_API_URL);

const api = new Pocketbase(import.meta.env.VITE_API_URL);

export const createAppUser = async (input: CreateAppUserInput) => {
  const appUser = await api.collection("app_users").create(input); // Add type

  return appUser;
};
