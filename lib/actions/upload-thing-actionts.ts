"use server";
import { UTApi } from "uploadthing/server";
import { formatError } from "../utils";

const utapi = new UTApi();

export async function deleteImage(imageUrl: string) {
  try {
    const fileKey = imageUrl.split("/").pop();
    if (!fileKey) throw new Error("Invalid image URL");

    const res = await utapi.deleteFiles(fileKey);

    if (!res.success) {
      throw new Error("Failed to delete image");
    }

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
