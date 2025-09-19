"use server";

import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
  TablesDB,
} from "node-appwrite";
import { appwriteConfigs } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

const { envs, constants } = appwriteConfigs;

// sessions
export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(envs.endpointUrl)
    .setProject(envs.projectId);

  const cookieInstance = await cookies();
  const session = cookieInstance.get(constants.cookieName);

  if (!session || !session.value) throw new Error("No session");

  client.setSession(session.value);
  const values = {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
  };

  return values;
};
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(envs.endpointUrl)
    .setProject(envs.projectId)
    .setKey(envs.secretKey);

  const values = {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },

    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };

  return values;
};
