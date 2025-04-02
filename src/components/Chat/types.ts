// src/components/Chat/types.ts

export type Tab = 'landing' | 'campaign';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  files?: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string; // For images
}
export type HeaderTab = "templates" | "assets";