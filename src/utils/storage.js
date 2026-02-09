import { ID } from "appwrite";
import { buildFilePreview, storage } from "../app/appwrite";
import { env } from "../env";

const extractFileIdFromUrl = (value) => {
  const text = String(value || "");
  const match = text.match(/\/files\/([^/]+)\//);
  return match ? match[1] : text;
};

export const getPropertyPhotoUrl = (fileId) =>
  buildFilePreview(env.APPWRITE_BUCKET_PROPERTY_PHOTOS_ID, fileId);

export const getAvatarPhotoUrl = (fileId) =>
  buildFilePreview(env.APPWRITE_BUCKET_USER_AVATARS_ID, fileId);

export async function uploadProfile(file) {
  const created = await storage.createFile(
    env.APPWRITE_BUCKET_USER_AVATARS_ID,
    ID.unique(),
    file
  );
  return getAvatarPhotoUrl(created.$id);
}

export async function uploadCover(file) {
  const created = await storage.createFile(
    env.APPWRITE_BUCKET_USER_AVATARS_ID,
    ID.unique(),
    file
  );
  return getAvatarPhotoUrl(created.$id);
}

export async function deleteProfileImage(fileOrUrl) {
  try {
    const fileId = extractFileIdFromUrl(fileOrUrl);
    if (!fileId) return false;
    await storage.deleteFile(env.APPWRITE_BUCKET_USER_AVATARS_ID, fileId);
    return true;
  } catch {
    return false;
  }
}

export async function uploadArticleImages(file) {
  try {
    if (typeof file === "string") {
      return extractFileIdFromUrl(file);
    }

    const created = await storage.createFile(
      env.APPWRITE_BUCKET_PROPERTY_PHOTOS_ID,
      ID.unique(),
      file
    );
    return created.$id;
  } catch {
    return false;
  }
}
