"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query, ID } from "node-appwrite";

import { appwriteConfigs } from "@/lib/appwrite/config";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";

import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "@/lib/utils";

const { envs, constants } = appwriteConfigs;

type UserActions = {
  verifySecret: (
    ...[payload]: [{ accountId: string; otp: string }]
  ) => Promise<any>;
  sendEmailOTP: (...[payload]: [{ email: string }]) => Promise<any>;
  getCurrentUser: (...[]: []) => Promise<any>;

  // main
  signup: (...[payload]: [{ fullName: string; email: string }]) => Promise<any>;
  login: (...[payload]: [{ email: string }]) => Promise<any>;
  logout: (...[]: []) => Promise<any>;
};

// helpers
const handleError = (error: unknown, message: string) => {
  throw error;
};
const getUserByEmail = async (email: string) => {
  const { databases, tablesDB } = await createAdminClient();

  // const result = await databases.listDocuments(
  //   envs.databaseId,
  //   envs.usersCollectionId,
  //   [Query.equal("email", [email])]
  // );
  const result = await tablesDB.listRows({
    databaseId: envs.databaseId,
    tableId: envs.usersCollectionId,
    queries: [Query.equal("email", email)],
  });

  // const user = result.total > 0 ? result.documents[0] : null
  const user = result.total > 0 ? result.rows[0] : null;

  return user;
};

//
export const sendEmailOTP: UserActions["sendEmailOTP"] = async (payload) => {
  const { email } = payload;
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken({
      userId: ID.unique(),
      email: email,
    });

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};
export const verifySecret: UserActions["verifySecret"] = async (payload) => {
  const { accountId, otp } = payload;

  try {
    const { account } = await createAdminClient();
    const curCookies = await cookies();

    const session = await account.createSession({
      userId: accountId,
      secret: otp,
    });

    const cookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    } as Record<string, any>;
    curCookies.set(constants.cookieName, session.secret, cookieOptions);

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};
export const getCurrentUser: UserActions["getCurrentUser"] = async () => {
  try {
    const { databases, tablesDB, account } = await createSessionClient();

    const result = await account.get();
    // const users = await databases.listDocuments({
    //   databaseId: envs.databaseId,
    //   collectionId: envs.usersCollectionId,
    //   queries: [Query.equal("accountId", result.$id)],
    // });
    const users = await tablesDB.listRows({
      databaseId: envs.databaseId,
      tableId: envs.usersCollectionId,
      queries: [Query.equal("accountId", result.$id)],
    });

    if (users.total <= 0) return null;
    // const user = user.documents[0]
    const user = users.rows[0];

    return parseStringify(user);
  } catch (error) {}
};

// main
export const signup: UserActions["signup"] = async (payload) => {
  const { fullName, email } = payload;

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    const { databases, tablesDB } = await createAdminClient();

    const payload = {
      fullName,
      email,
      avatar: avatarPlaceholderUrl,
      accountId,
    };

    // await databases.createDocument(
    //   envs.databaseId,
    //   envs.usersCollectionId,
    //   ID.unique(),
    //   payload
    // );
    await tablesDB.createRow({
      databaseId: envs.databaseId,
      tableId: envs.usersCollectionId,
      rowId: ID.unique(),
      data: payload,
    });
  }

  return parseStringify({ accountId });
};
export const login: UserActions["login"] = async (payload) => {
  const { email } = payload;

  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to login user");
  }
};
export const logout: UserActions["logout"] = async () => {
  // const {} = payload;
  const { account } = await createSessionClient();

  try {
    const curCookies = await cookies();

    await account.deleteSession({
      sessionId: "current",
    });
    curCookies.delete(constants.cookieName);
  } catch (error) {
    handleError(error, "Failed to logout user");
  } finally {
    redirect("/login");
  }
};
