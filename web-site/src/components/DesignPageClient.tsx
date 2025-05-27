import React, { useMemo } from "react";
import { Design, DesignProvider, DesignContextProps } from "@go-blite/design";
import { assets } from "../data/assets";
interface DesignPageClientProps {
  devices: DesignContextProps["device"];
}

const DesignPageClient: React.FC<DesignPageClientProps> = ({ devices }) => {
  const initialProps = useMemo<Partial<DesignContextProps>>(() => {
    if (!devices || devices.length === 0 || !devices[0]?.languagePageMap?.["zh"]?.schema) {
      return {
        device: devices || [],
        schema: {} // Default to empty schema
      };
    }
    
    // 确保 schema 正确传递
    const schema = devices[0].languagePageMap["zh"].schema;
    console.log('Schema being passed to DesignProvider:', schema);
    
    return {
      device: devices,
      schema: schema,
      assets: assets as unknown as DesignContextProps["assets"],
      // 确保 currentInfo 也被正确设置
      currentInfo: {
        device: "desktop",
        pageTemplate: "static-download",
        language: "zh"
      }
    };
  }, [devices]);

  if (!devices || devices.length === 0) {
    return <div>Loading devices or no devices configured...</div>;
  }

  if (!initialProps.schema || Object.keys(initialProps.schema).length === 0) {
    if (devices && devices.length > 0) {
      return <div>Error: Could not derive a valid schema from the provided devices.</div>;
    }
  }
  console.log(initialProps, "initialProps");

  return (
    <DesignProvider initialProps={initialProps}>
      <Design />
    </DesignProvider>
  );
};

export default DesignPageClient;
