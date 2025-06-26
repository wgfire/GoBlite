import { useState } from "react";
import DesignPageClient from "./components/DesignPageClient";
import { devices } from "./data/mock";
import { DesignContextProps, Loading, ROOT_NODE, SerializedNodes } from "@go-blite/design";
import { getTemplates, getTopicConfig, Templates } from "@/api/module/topic/getTemplates";
import { useMount } from "ahooks";
import { useCrowdin } from "./hooks/useCrowdin";
const projectId = 44;

const App: React.FC = () => {
  const [templates, setTemplates] = useState<NonNullable<DesignContextProps["templates"]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [devicesData, setDevicesData] = useState<DesignContextProps["device"]>([]);
  const [i18nState, setI18nState] = useState({
    langCode: "",
    fileName: "",
    projectId: 44,
    translation: undefined
  });
  const { fetchTranslationData } = useCrowdin();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  console.log(id, "模版id");
  /**
   * 获取模版数据
   */
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
  /**
   * 获取专题配置
   */
  const getTopicData = async () => {
    setIsLoading(true);
    const res = await getTopicConfig(Number(id));
    try {
      const result = await res.json();
      const data = result.value.TopicConfigInfo;
      const devicesData: DesignContextProps["device"] = JSON.parse(data.content);
      devicesData.forEach(item => {
        const pageData = item.languagePageMap[data.langCode].schema as SerializedNodes;
        if (pageData && pageData[ROOT_NODE]) {
          pageData[ROOT_NODE].props.title = data.title;
          pageData[ROOT_NODE].props.h5Title = data.h5Title;
        }
      });
      setI18nState(prev => ({
        ...prev,
        langCode: data.langCode,
        fileName: `${data.title}.json`
      }));
      console.log(devicesData, "专题配置", data);
      setDevicesData(devicesData);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("获取专题配置失败:", error);
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
  const getTranslationData = async (fileName: string, languageId: string) => {
    try {
      const data = await fetchTranslationData({
        projectId,
        fileName,
        languageId
      });
      console.log(data, "翻译数据");
      setI18nState(prev => ({
        ...prev,
        fileName,
        translation: data
      }));
    } catch (error) {
      console.error("获取翻译数据失败:", error);
      setI18nState(prev => ({
        ...prev,
        translation: undefined
      }));
    }
  };
  const initData = async () => {
    try {
      const topicData = await getTopicData();
      const fileName = `${topicData.title}.json`;
      await getTranslationData(fileName, topicData.langCode);
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useMount(() => {
    getTemplatesData();
    if (id) {
      initData();
    } else {
      const devicesData = getDevicesData();
      setDevicesData(devicesData);
    }
  });

  if (isLoading) {
    return <Loading loading={isLoading} />;
  }
  return <DesignPageClient devices={devicesData} templates={templates} i18n={i18nState} />;
};

export default App;
