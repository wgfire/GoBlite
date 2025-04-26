// src/components/Chat/types.ts

export type Tab = "landing" | "campaign";

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string; // For images
}
export type HeaderTab = "templates" | "assets" | "conversations";
