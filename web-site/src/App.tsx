import { useState } from "react";
import DesignPageClient from "./components/DesignPageClient";
import { devices } from "./data/mock";
import { DesignContextProps, Loading } from "@go-blite/design";
import { getTemplates, Templates } from "./api/getTemplates";
import { useMount } from "ahooks";
const App: React.FC = () => {
  const [templates, setTemplates] = useState<NonNullable<DesignContextProps["templates"]>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [devicesData, setDevicesData] = useState<DesignContextProps["device"]>([]);
  const getTemplatesData = async () => {
    setIsLoading(true);
    const res = await getTemplates();
    try {
      const result = await res.json();
      const data = result.value.templateTypeList as Array<Templates>;
      const templatesData = data.map(item => {
        const type = item.name;
        const list = item.templateList.map(el => {
          return {
            name: el.name,
            devices: JSON.parse(el.content)
          };
        });
        return {
          type,
          list
        };
      });
      setTemplates(templatesData);
      setIsLoading(false);
    } catch (error) {
      console.error("获取模板数据失败:", error);
      setIsLoading(false);
    }
  };
  const getDevicesData = () => {
    const schema = localStorage.getItem("schema");
    if (schema) {
      return JSON.parse(schema);
    }
    return devices;
  };
  useMount(() => {
    getTemplatesData();
    const devicesData = getDevicesData();
    setDevicesData(devicesData);
  });

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  return <DesignPageClient devices={devicesData} templates={templates} />;
};

export default App;
