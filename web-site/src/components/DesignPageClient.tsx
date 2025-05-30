import React, { useMemo, useEffect } from "react";
import { Design, DesignProvider, DesignContextProps } from "@go-blite/design";
import { BusinessEvents } from "@go-blite/design";
import { assets } from "../data/assets";
import { useUploadService } from "../hooks/useUploadSerivce";
interface DesignPageClientProps {
  devices: DesignContextProps["device"];
  templates: DesignContextProps["templates"];
}

const DesignPageClient: React.FC<DesignPageClientProps> = ({ devices, templates }) => {
  const { processDownloadAndUpload } = useUploadService(); // Renamed isProcessing as it's not used yet
  const initialProps = useMemo<Partial<DesignContextProps>>(() => {
    if (!devices || devices.length === 0 || !devices[0]?.languagePageMap?.["zh"]?.schema) {
      return {
        device: devices || [],
        schema: {} // Default to empty schema
      };
    }

    // 确保 schema 正确传递
    const schema = devices[0].languagePageMap["zh"].schema;
    console.log("Schema being passed to DesignProvider:", schema);

    return {
      device: devices,
      schema: schema,
      templates: templates,
      assets: assets as unknown as DesignContextProps["assets"],
      // 确保 currentInfo 也被正确设置
      currentInfo: {
        device: "mobile",
        pageTemplate: "static-download",
        language: "zh"
      }
    };
  }, [devices, templates]);

  if (!devices || devices.length === 0) {
    return <div>Loading devices or no devices configured...</div>;
  }

  if (!initialProps.schema || Object.keys(initialProps.schema).length === 0) {
    if (devices && devices.length > 0) {
      return <div>Error: Could not derive a valid schema from the provided devices.</div>;
    }
  }
  console.log(initialProps, "initialProps");

  useEffect(() => {
    const handleDownloadEvent = (data: { device: DesignContextProps["device"] }) => {
      processDownloadAndUpload(data);
    };

    BusinessEvents.on("onDownload", handleDownloadEvent as unknown as (data: BusinessEventPayload) => void);

    return () => {
      BusinessEvents.off("onDownload", handleDownloadEvent as unknown as (data: BusinessEventPayload) => void);
    };
  }, []);

  return (
    <DesignProvider initialProps={initialProps}>
      <Design />
    </DesignProvider>
  );
};

export default DesignPageClient;
