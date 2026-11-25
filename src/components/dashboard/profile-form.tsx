"use client";

import Image from "next/image";
import { Camera, LoaderCircle, UserRound } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProfileFormProps = {
  name: string;
  email: string;
  image: string | null;
  phone?: string;
  bio?: string;
  bannerImage?: string | null;
  role: string;
};

export function ProfileForm({
  name,
  email,
  image,
  phone: initialPhone = "",
  bio: initialBio = "",
  bannerImage = null,
  role,
}: ProfileFormProps) {
  const router = useRouter();
  const showToast = useToast();
  const previewObjectUrl = useRef<string | null>(null);
  const bannerPreviewObjectUrl = useRef<string | null>(null);
  const [displayName, setDisplayName] = useState(name);
  const [phone, setPhone] = useState(initialPhone);
  const [bio, setBio] = useState(initialBio);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(image);
  const [bannerPreview, setBannerPreview] = useState(bannerImage);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(
    () => () => {
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
      }
      if (bannerPreviewObjectUrl.current) {
        URL.revokeObjectURL(bannerPreviewObjectUrl.current);
      }
    },
    [],
  );

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
    setSelected: Dispatch<SetStateAction<File | null>>,
    setPreview: Dispatch<SetStateAction<string | null>>,
    previewUrl: MutableRefObject<string | null>,
  ) {
    const file = event.currentTarget.files?.[0] ?? null;
    setErrorMessage("");
    if (!file) return;

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
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);

    const objectUrl = URL.createObjectURL(file);
    previewUrl.current = objectUrl;
    setSelected(file);
    setPreview(objectUrl);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = displayName.trim();
    if (trimmedName.length < 2) {
      setErrorMessage("Name must be at least 2 characters.");
      return;
    }
    if (phone.trim().length > 30 || bio.trim().length > 500) {
      setErrorMessage("Phone number must be 30 characters or less and bio 500 characters or less.");
      return;
    }

    setIsSaving(true);
    let updatedImage: string | undefined;
    let updatedBannerImage: string | undefined;

    try {
      async function uploadImage(file: File, description: string) {
        const uploadData = new FormData();
        uploadData.set("image", file);

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
              : `Unable to upload ${description}. Please try again.`;
          throw new Error(message);
        }

        return uploadResult.url;
      }

      if (selectedImage) {
        updatedImage = await uploadImage(selectedImage, "the profile photo");
      }
      if (selectedBannerImage) {
        updatedBannerImage = await uploadImage(selectedBannerImage, "the tutor banner");
      }

      const response = await fetch("/api/users/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: phone.trim(),
          bio: bio.trim(),
          ...(updatedImage ? { image: updatedImage } : {}),
          ...(updatedBannerImage ? { bannerImage: updatedBannerImage } : {}),
        }),
      });
      const result: unknown = await response.json();

      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("success" in result) ||
        result.success !== true
      ) {
        const message =
          result &&
          typeof result === "object" &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "Unable to update your profile. Please try again.";
        throw new Error(message);
      }

      if (updatedImage) {
        setImagePreview(updatedImage);
        setSelectedImage(null);
        if (previewObjectUrl.current) {
          URL.revokeObjectURL(previewObjectUrl.current);
          previewObjectUrl.current = null;
        }
      }
      if (updatedBannerImage) {
        setBannerPreview(updatedBannerImage);
        setSelectedBannerImage(null);
        if (bannerPreviewObjectUrl.current) {
          URL.revokeObjectURL(bannerPreviewObjectUrl.current);
          bannerPreviewObjectUrl.current = null;
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
            onChange={(event) =>
              handleImageChange(
                event,
                setSelectedImage,
                setImagePreview,
                previewObjectUrl,
              )
            }
            className="sr-only"
          />
          {role === "tutor" && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {bannerPreview ? (
                  <Image
                    src={bannerPreview}
                    alt="Tutor banner preview"
                    width={112}
                    height={64}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No banner</span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold">Tutor banner</h3>
                <label
                  htmlFor="tutor-banner"
                  className="mt-2 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Camera className="size-4" />
                  Choose banner
                </label>
                <input
                  id="tutor-banner"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    handleImageChange(
                      event,
                      setSelectedBannerImage,
                      setBannerPreview,
                      bannerPreviewObjectUrl,
                    )
                  }
                  className="sr-only"
                />
              </div>
            </div>
          )}
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
            minLength={2}
            maxLength={100}
            value={displayName}
            onChange={(event) => setDisplayName(event.currentTarget.value)}
            className="h-11 rounded-lg border bg-background px-3 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Phone number
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            value={phone}
            onChange={(event) => setPhone(event.currentTarget.value)}
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
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Bio
          <textarea
            name="bio"
            maxLength={500}
            rows={4}
            value={bio}
            onChange={(event) => setBio(event.currentTarget.value)}
            className="resize-y rounded-lg border bg-background px-3 py-2 outline-none transition-shadow focus:ring-3 focus:ring-ring/30"
          />
          <span className="text-xs font-normal text-muted-foreground">
            {bio.length}/500 characters
          </span>
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
