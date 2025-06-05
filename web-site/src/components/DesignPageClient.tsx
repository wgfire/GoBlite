import React, { useMemo, useEffect } from "react";
import { Design, DesignProvider, DesignContextProps } from "@go-blite/design";
import { BusinessEvents } from "@go-blite/design";
import { assets } from "../data/assets";
import { useUploadService } from "../hooks/useUploadService";
import { saveSource } from "../api/saveSource";
import { toast } from "@go-blite/shadcn/hooks";
interface DesignPageClientProps {
  devices: DesignContextProps["device"];
  templates: DesignContextProps["templates"];
}

const DesignPageClient: React.FC<DesignPageClientProps> = ({ devices, templates }) => {
  const { processDownloadAndUpload } = useUploadService();
  const initialProps = useMemo<Partial<DesignContextProps>>(() => {
    if (!devices || devices.length === 0) {
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
  const handleDownloadEvent = async (data: { device: DesignContextProps["device"] }) => {
    try {
      const result = await processDownloadAndUpload(data);
      console.log(result, "result");
      const zipPath = result.value[0].path;
      saveSource({
        id: 0,
        content: JSON.stringify(data.device),
        zipPath
      });
    } catch (error) {
      console.error("处理下载和上传过程中发生错误:", error);
    }
  };
  const handleSaveEvent = () => {
    toast({
      title: "保存本地成功",
      description: "下次进来，会加载您保存的数据",
      variant: "default"
    });
  };

  useEffect(() => {
    BusinessEvents.on("onDownload", handleDownloadEvent as unknown as (data: unknown) => void);
    BusinessEvents.on("onSave", handleSaveEvent);

    return () => {
      BusinessEvents.off("onDownload", handleDownloadEvent as unknown as (data: unknown) => void);
      BusinessEvents.off("onSave", handleSaveEvent);
    };
  }, []);

  return (
    <DesignProvider initialProps={initialProps}>
      <Design />
    </DesignProvider>
  );
};

export default DesignPageClient;
