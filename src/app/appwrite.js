import {
  Account,
  Client,
  Databases,
  Functions,
  ID,
  Permission,
  Query,
  Role,
  Storage,
} from "appwrite";
import { env } from "../env";

const client = new Client()
  .setEndpoint(env.APPWRITE_ENDPOINT)
  .setProject(env.APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const functions = new Functions(client);

const toFileUrl = (urlLike) => String(urlLike || "");

const buildFilePreview = (bucketId, fileId) =>
  toFileUrl(storage.getFilePreview(bucketId, fileId, 1200, 900, "center", 85));

const buildFileView = (bucketId, fileId) =>
  toFileUrl(storage.getFileView(bucketId, fileId));

const userPermissions = (userId) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
];

export {
  account,
  client,
  databases,
  functions,
  storage,
  ID,
  Permission,
  Query,
  Role,
  buildFilePreview,
  buildFileView,
  userPermissions,
};
