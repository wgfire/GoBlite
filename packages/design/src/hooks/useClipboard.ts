import { useCallback, useEffect, useState } from "react";
import { useNodeCalculate } from "./useNodeCalculate";

interface ImageParseResult {
  [nodeId: string]: {
    resolvedName: string;
    props: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };
    imageData?: {
      format: string;
      width: number;
      height: number;
      aspectRatio: number;
      originalNodeType: string;
    };
  };
}

interface UseClipboardResult {
  readParseResult: () => Promise<ImageParseResult | null>;
  writeToClipboard: (data: string) => Promise<void>;
  lastPastedData: ImageParseResult | null;
  onPaste?: (data: ImageParseResult) => void;
}

export const useClipboard = (onPaste?: (data: ImageParseResult) => void): UseClipboardResult => {
  const [lastPastedData, setLastPastedData] = useState<ImageParseResult | null>(null);
  const { addNodeSetAttribute } = useNodeCalculate();

  const readParseResult = useCallback(async (): Promise<ImageParseResult | null> => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return null;

      // Try to parse the clipboard content as JSON
      const parsedData = JSON.parse(text) as ImageParseResult;

      const isValidFormat = Object.values(parsedData).every(
        item => item.resolvedName === "Image" && item.props && typeof item.props.src === "string"
      );

      if (!isValidFormat) {
        console.warn("Clipboard data is not in valid ImageParseResult format");
        return null;
      }

      return parsedData;
    } catch (error) {
      console.error("Error reading clipboard:", error);
      return null;
    }
  }, []);

  const writeToClipboard = useCallback(async (data: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(data);
    } catch (error) {
      console.error("Error writing to clipboard:", error);
      throw error;
    }
  }, []);

  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      try {
        if (event.isTrusted) {
          const parsedData = (await readParseResult()) as ImageParseResult;
          setLastPastedData(parsedData);
          addNodeSetAttribute(parsedData);
          onPaste?.(parsedData);
        }
      } catch (error) {
        console.error("Error handling paste event:", error);
      }
    },
    [onPaste]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  return {
    readParseResult,
    writeToClipboard,
    lastPastedData,
    onPaste
  };
};
