import { headers } from "next/headers";
import { getBackendSession } from "@/lib/backend-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 64 * 1024;

export async function POST(request: Request) {
  const session = await getBackendSession(await headers());

  if (!session) {
    return Response.json({ error: "Sign in to upload a profile image." }, { status: 401 });
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_REQUEST_SIZE) {
    return Response.json({ error: "The image must be 5 MB or smaller." }, { status: 413 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Profile image uploads are not configured yet." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "The upload request is invalid." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  if (image.size > MAX_FILE_SIZE) {
    return Response.json({ error: "The image must be 5 MB or smaller." }, { status: 413 });
  }

  const imageBytes = await image.arrayBuffer();
  if (!matchesImageSignature(image.type, new Uint8Array(imageBytes))) {
    return Response.json(
      { error: "Choose a valid JPEG, PNG, or WebP image." },
      { status: 415 },
    );
  }

  const imageExtension =
    image.type === "image/jpeg" ? "jpg" : image.type === "image/png" ? "png" : "webp";
  const uploadData = new FormData();
  uploadData.set(
    "image",
    new Blob([imageBytes], { type: image.type }),
    `avatar.${imageExtension}`,
  );
  const uploadUrl = new URL("https://api.imgbb.com/1/upload");
  uploadUrl.searchParams.set("key", apiKey);

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    console.error("ImgBB profile image upload request failed.", error);
    return Response.json(
      { error: "The image service could not be reached. Please try again." },
      { status: 502 },
    );
  }

  if (!uploadResponse.ok) {
    console.error(
      "ImgBB profile image upload returned an unsuccessful response.",
      uploadResponse.status,
    );
    return Response.json(
      { error: "The image service could not upload this photo. Please try again." },
      { status: 502 },
    );
  }

  let payload: unknown;
  try {
    payload = await uploadResponse.json();
  } catch {
    return Response.json(
      { error: "The image service returned an invalid response." },
      { status: 502 },
    );
  }

  const imageUrl = getImgBbImageUrl(payload);
  if (!imageUrl) {
    return Response.json(
      { error: "The image service did not return a usable image URL." },
      { status: 502 },
    );
  }

  return Response.json({ url: imageUrl });
}

function matchesImageSignature(mimeType: string, bytes: Uint8Array) {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (mimeType === "image/webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }

  return false;
}

function getImgBbImageUrl(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("success" in payload) || !payload.success) {
    return null;
  }

  if (!("data" in payload) || !payload.data || typeof payload.data !== "object") {
    return null;
  }

  if (!("url" in payload.data) || typeof payload.data.url !== "string") {
    return null;
  }

  try {
    const url = new URL(payload.data.url);
    return url.protocol === "https:" && (url.hostname === "ibb.co" || url.hostname.endsWith(".ibb.co"))
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
