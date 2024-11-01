import DesignPage from "./Client";
import mockData from "../mock.json";
import { notFound } from "next/navigation";

type MockDataItem = (typeof mockData)[0];

// 获取指定设备和语言的 schema
const getSchemaByDeviceAndLanguage = (device: string, language: string): object | null => {
  const deviceData = mockData.find((item: MockDataItem) => item.type === device);
  if (!deviceData) return null;

  const languageSchema = deviceData.languagePageMap[language]?.schema;
  return languageSchema || null;
};

export const generateStaticParams = async () => {
  const params: { device: string; language: string }[] = [];

  mockData.forEach((item: MockDataItem) => {
    const languages = Object.keys(item.languagePageMap);
    languages.forEach(lang => {
      params.push({
        device: item.type,
        language: lang
      });
    });
  });

  return params;
};

type PageProps = {
  params: {
    device: string;
    language: string;
  };
};

const ServerComponent = async ({ params }: PageProps) => {
  const { device, language } = params;
  try {
    const schema = getSchemaByDeviceAndLanguage(device, language);
    if (!schema) {
      notFound();
    }
    return <DesignPage initialData={schema} />;
  } catch (error) {
    console.error("Error loading schema:", error);
    notFound();
  }
};

export default ServerComponent;
