import Pocketbase from "pocketbase";
import { CreateAppUserInput } from "@/api/types";

// TODO: Add this to environment variable later
const pb = new Pocketbase("https://api.pachtop.com");

export const createAppUser = async (input: CreateAppUserInput) => {
  const appUser = await pb.collection("app_users").create(input);
  return appUser;
};
