"use client";

import Image from "next/image";
import { Camera, LoaderCircle, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { authClient } from "@/lib/auth-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProfileFormProps = {
  name: string;
  email: string;
  image: string | null;
  role: string;
};

export function ProfileForm({ name, email, image, role }: ProfileFormProps) {
  const router = useRouter();
  const showToast = useToast();
  const previewObjectUrl = useRef<string | null>(null);
  const [displayName, setDisplayName] = useState(name);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(image);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(
    () => () => {
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
      }
    },
    [],
  );

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    setErrorMessage("");

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage("Choose a JPEG, PNG, or WebP image.");
      event.currentTarget.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("The image must be 5 MB or smaller.");
      event.currentTarget.value = "";
      return;
    }

    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewObjectUrl.current = objectUrl;
    setSelectedImage(file);
    setImagePreview(objectUrl);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setErrorMessage("Name is required.");
      return;
    }

    setIsSaving(true);
    let updatedImage: string | undefined;

    try {
      if (selectedImage) {
        const uploadData = new FormData();
        uploadData.set("image", selectedImage);

        const uploadResponse = await fetch("/api/profile/avatar", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult: unknown = await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadResult ||
          typeof uploadResult !== "object" ||
          !("url" in uploadResult) ||
          typeof uploadResult.url !== "string"
        ) {
          const message =
            uploadResult &&
            typeof uploadResult === "object" &&
            "error" in uploadResult &&
            typeof uploadResult.error === "string"
              ? uploadResult.error
              : "Unable to upload the profile photo. Please try again.";
          setErrorMessage(message);
          return;
        }

        updatedImage = uploadResult.url;
      }

      const { error } = await authClient.updateUser({
        name: trimmedName,
        ...(updatedImage ? { image: updatedImage } : {}),
      });

      if (error) {
        setErrorMessage(error.message || "Unable to update your profile. Please try again.");
        return;
      }

      if (updatedImage) {
        setImagePreview(updatedImage);
        setSelectedImage(null);
        if (previewObjectUrl.current) {
          URL.revokeObjectURL(previewObjectUrl.current);
          previewObjectUrl.current = null;
        }
      }

      showToast("Profile updated successfully.");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border bg-background p-5 sm:p-7">
      <div className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center">
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile photo preview"
              width={96}
              height={96}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <UserRound className="size-10" />
          )}
        </div>
        <div>
          <h2 className="font-semibold">Profile photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            JPEG, PNG, or WebP. Maximum file size: 5 MB.
          </p>
          <label
            htmlFor="profile-image"
            className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Camera className="size-4" />
            Choose photo
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="sr-only"
          />
        </div>
      </div>

      <div className="grid gap-5 py-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Full name
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={displayName}
            onChange={(event) => setDisplayName(event.currentTarget.value)}
            className="h-11 rounded-lg border bg-background px-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email address
          <input
            type="email"
            autoComplete="email"
            value={email}
            readOnly
            className="h-11 rounded-lg border bg-muted/40 px-3 text-muted-foreground outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Account type
          <input
            type="text"
            value={role === "admin" ? "Administrator" : role === "tutor" ? "Tutor" : "Student"}
            readOnly
            className="h-11 rounded-lg border bg-muted/40 px-3 text-muted-foreground outline-none"
          />
        </label>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end border-t pt-5">
        <Button type="submit" disabled={isSaving}>
          {isSaving && <LoaderCircle className="animate-spin" />}
          {isSaving ? "Saving profile..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
