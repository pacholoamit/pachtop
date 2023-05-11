import Pocketbase from "pocketbase";
import { CreateAppUserInput } from "@/api/types";
import { Dir } from "fs";
import { User } from "@/api";

// TODO: Add this to environment variable later
const api = new Pocketbase("https://api.pachtop.com");

export const createAppUser = async (input: CreateAppUserInput) => {
  const appUser = await api.collection("app_users").create(input); // Add type

  return appUser;
};
