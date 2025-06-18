import React, { useMemo, useEffect } from "react";
import { Design, DesignProvider, DesignContextProps } from "@go-blite/design";
import { BusinessEvents } from "@go-blite/design";
import { assets } from "../data/assets";
import { useUploadService } from "@/hooks/useUploadService";
import { saveSource } from "@/api/module/topic/saveSource";
import { toast } from "@go-blite/shadcn/hooks";
import { businessComponents } from "../selectors";
interface DesignPageClientProps {
  devices: DesignContextProps["device"];
  templates: DesignContextProps["templates"];
  langCode?: string;
}

const DesignPageClient: React.FC<DesignPageClientProps> = ({ devices, templates, langCode }) => {
  const { processDownloadAndUpload } = useUploadService();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const initialProps = useMemo<Partial<DesignContextProps>>(() => {
    let schemaToUse: DesignContextProps["schema"] = {};
    let firstLanguageFromDevice: string | undefined = undefined;

    // 仅当 devices 存在且不为空时，尝试从中提取 schema 和语言
    if (devices && devices.length > 0) {
      const firstDevice = devices[0];
      // 确保 languagePageMap 存在且有内容
      if (firstDevice?.languagePageMap && Object.keys(firstDevice.languagePageMap).length > 0) {
        firstLanguageFromDevice = Object.keys(firstDevice.languagePageMap)[0];
        // 安全地获取 schema，如果 firstLanguageFromDevice 对应的 schema 不存在，则默认为 {}
        schemaToUse = firstDevice.languagePageMap[firstLanguageFromDevice]?.schema || {};
      }
    }

    // 确定最终使用的语言：优先使用 langCode，其次是设备中的第一个可用语言，最后是默认的 "zh-CN"
    const languageToUse = langCode || firstLanguageFromDevice || "zh-CN";

    return {
      device: devices || [],
      schema: schemaToUse,
      templates,
      assets: assets as unknown as DesignContextProps["assets"],
      currentInfo: {
        device: "mobile",
        pageTemplate: "static-download",
        language: languageToUse
      },
      resolver: businessComponents
    };
  }, [devices, templates, langCode]);

  console.log("initialProps: " + initialProps);
  const handleDownloadEvent = async (data: { device: DesignContextProps["device"] }) => {
    console.log(data.device, "data.device");
    const params = {
      device: data.device,
      projectName: "mt-goblite-web-" + id
    };
    try {
      const result = await processDownloadAndUpload(params);
      console.log(result, "result");
      const zipPath = result.value[0].path;
      if (id) {
        saveSource({
          id: Number(id),
          content: JSON.stringify(data.device),
          zipPath
        });
      }
    } catch (error) {
      console.error("处理下载和上传过程中发生错误:", error);
    }
  };
  const handleSaveEvent = (data: { device: DesignContextProps["device"] }) => {
    console.log(data, "data");
    toast({
      title: "保存本地成功",
      description: "下次进来，会加载您保存的数据",
      variant: "default"
    });
  };

  useEffect(() => {
    BusinessEvents.on("onDownload", handleDownloadEvent as unknown as (data: unknown) => void);
    BusinessEvents.on("onSave", handleSaveEvent as unknown as (data: unknown) => void);

    return () => {
      BusinessEvents.off("onDownload", handleDownloadEvent as unknown as (data: unknown) => void);
      BusinessEvents.off("onSave", handleSaveEvent as unknown as (data: unknown) => void);
    };
  }, []);

  return (
    <DesignProvider initialProps={initialProps}>
      <Design />
    </DesignProvider>
  );
};

export default DesignPageClient;
