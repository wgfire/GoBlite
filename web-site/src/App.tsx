import { useEffect, useState } from "react";
import DesignPageClient from "./components/DesignPageClient";
import { devices } from "./data/mock";
import { DesignContextProps, Loading } from "@go-blite/design";
import { getTemplates, Templates } from "./api/getTemplates";
const App: React.FC = () => {
  const [templates, setTemplates] = useState<NonNullable<DesignContextProps["templates"]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getTemplatesData = async () => {
    const res = await getTemplates();
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
  };
  useEffect(() => {
    getTemplatesData();
  }, []);

  const validDevices = Array.isArray(devices) ? devices : [];
  if (isLoading || templates.length === 0) {
    return <Loading loading={isLoading} />;
  }
  return <DesignPageClient devices={validDevices as unknown as DesignContextProps["device"]} templates={templates} />;
};

export default App;
