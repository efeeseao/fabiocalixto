import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { betterFetch } from "@better-fetch/fetch";

const f = createUploadthing();

const auth = async (req: Request) => {
  const { data } = await betterFetch<{
    user?: { role: string; status: string };
  }>("/api/auth/get-session", {
    baseURL: new URL(req.url).origin,
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  if (
    !data?.user ||
    data.user.role !== "ADMIN" ||
    data.user.status !== "APPROVED"
  ) {
    throw new UploadThingError("Unauthorized");
  }

  return { id: "admin" };
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
