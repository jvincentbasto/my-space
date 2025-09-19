"use server";

import { revalidatePath } from "next/cache";
import { InputFile } from "node-appwrite/file";
import { ID, Query } from "node-appwrite";

import { appwriteConfigs } from "@/lib/appwrite/config";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { getCurrentUser } from "@/lib/actions/user.actions";

import { parseStringify } from "@/lib/utils";
import { appwriteUtils } from "@/lib/appwriteUtils";
import { fileUtils } from "@/lib/fileUtils";

const { envs } = appwriteConfigs;
const { constructFileUrl } = appwriteUtils;
const { getFileType } = fileUtils;

export type FileType = "document" | "image" | "video" | "audio" | "other";
type FileActions = {
  createQueries: (
    ...[currentUser, types, searchText, sort, limit]: [
      Record<string, any>,
      string[],
      string,
      string,
      number?,
    ]
  ) => string[];

  // files
  uploadFile: (
    ...[payload]: [
      {
        file: File;
        ownerId: string;
        accountId: string;
        path: string;
      },
    ]
  ) => Promise<any>;
  getFiles: (
    ...[payload]: [
      {
        types: FileType[];
        searchText?: string;
        sort?: string;
        limit?: number;
      },
    ]
  ) => Promise<any>;

  updateFile: (
    ...[payload]: [
      {
        fileId: string;
        emails: string[];
        path: string;
      },
    ]
  ) => Promise<any>;
  deleteFile: (
    ...[payload]: [
      {
        fileId: string;
        bucketField: string;
        path: string;
      },
    ]
  ) => Promise<any>;

  //
  renameFile: (
    ...[payload]: [
      {
        fileId: string;
        name: string;
        extension: string;
        path: string;
      },
    ]
  ) => Promise<any>;
  getTotalSpaceUsed: (...[]: []) => Promise<any>;
};

// helpers
const handleError = (error: unknown, message: string) => {
  throw error;
};
const createQueries: FileActions["createQueries"] = (...payload) => {
  const [currentUser, types, searchText, sort, limit] = payload;

  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return queries;
};

// files
export const getFiles: FileActions["getFiles"] = async (payload) => {
  const {
    types = [],
    searchText = "",
    sort = "$createdAt-desc",
    limit,
  } = payload;
  const { databases, tablesDB } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");
    const queries = createQueries(currentUser, types, searchText, sort, limit);

    // const files = await databases.listDocuments(
    //   envs.databaseId,
    //   envs.filesCollectionId,
    //   queries
    // );
    const files = await tablesDB.listRows({
      databaseId: envs.databaseId,
      tableId: envs.filesCollectionId,
      queries,
    });

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};
export const uploadFile: FileActions["uploadFile"] = async (payload) => {
  const { file, ownerId, accountId, path } = payload;
  const { storage, databases, tablesDB } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    // const bucketFile = await storage.createFile(
    //   envs.bucketId,
    //   ID.unique(),
    //   inputFile
    // );
    const bucketFile = await storage.createFile({
      bucketId: envs.bucketId,
      fileId: ID.unique(),
      file: inputFile,
    });

    const test = constructFileUrl(bucketFile.$id);

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketField: bucketFile.$id,
    };

    let newFile;
    try {
      // newFile = await databases.createDocument(
      //   envs.databaseId,
      //   envs.filesCollectionId,
      //   ID.unique(),
      //   fileDocument
      // );
      newFile = await tablesDB.createRow({
        databaseId: envs.databaseId,
        tableId: envs.filesCollectionId,
        rowId: ID.unique(),
        data: fileDocument,
      });
    } catch (e) {
      // await storage.deleteFile(envs.bucketId, bucketFile.$id);
      await storage.deleteFile({
        bucketId: envs.bucketId,
        fileId: bucketFile.$id,
      });

      handleError(e, "Failed to create file document");
    }

    revalidatePath(path);
    return parseStringify(newFile ?? "");
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
export const updateFile: FileActions["updateFile"] = async (payload) => {
  const { fileId, emails, path } = payload;
  const { databases, tablesDB } = await createAdminClient();

  try {
    const payloadUpdate = { users: emails };

    // const updatedFile = await databases.updateDocument(
    //   envs.databaseId,
    //   envs.filesCollectionId,
    //   fileId,
    //   payloadUpdate
    // );
    const updatedFile = await tablesDB.updateRow({
      databaseId: envs.databaseId,
      tableId: envs.filesCollectionId,
      rowId: fileId,
      data: payloadUpdate,
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
export const deleteFile: FileActions["deleteFile"] = async (payload) => {
  const { fileId, bucketField, path } = payload;
  const { databases, tablesDB, storage } = await createAdminClient();

  try {
    // const deletedFile = await databases.deleteDocument(
    //   envs.databaseId,
    //   envs.filesCollectionId,
    //   fileId
    // );
    const deletedFile = await tablesDB.deleteRow({
      databaseId: envs.databaseId,
      tableId: envs.filesCollectionId,
      rowId: fileId,
    });

    if (deletedFile) {
      // await storage.deleteFile(envs.bucketId, bucketField);
      await storage.deleteFile({
        bucketId: envs.bucketId,
        fileId: bucketField,
      });
    }

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

//
export const renameFile: FileActions["renameFile"] = async (payload) => {
  const { fileId, name, extension, path } = payload;
  const { databases, tablesDB } = await createAdminClient();

  try {
    const payloadUpdate = {
      name: `${name}.${extension}`,
    };

    // const updatedFile = await databases.updateDocument(
    //   envs.databaseId,
    //   envs.filesCollectionId,
    //   fileId,
    //   payloadUpdate
    // );
    const updatedFile = await tablesDB.updateRow({
      databaseId: envs.databaseId,
      tableId: envs.filesCollectionId,
      rowId: fileId,
      data: payloadUpdate,
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
export const getTotalSpaceUsed: FileActions["getTotalSpaceUsed"] = async () => {
  try {
    const { databases, tablesDB } = await createSessionClient();

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    // const files = await databases.listDocuments(
    //   envs.databaseId,
    //   envs.filesCollectionId,
    //   [Query.equal("owner", [currentUser.$id])]
    // );
    const files = await tablesDB.listRows({
      databaseId: envs.databaseId,
      tableId: envs.filesCollectionId,
      queries: [Query.equal("owner", [currentUser.$id])],
    });

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.rows.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used");
  }
};
