import DesignPage from "./Client";
import mockData from "../mock.json";

type MockDataItem = (typeof mockData)[0];

// 获取指定设备和语言的 schema
const getSchemaByDeviceAndLanguage = (device: string, language: string): object | null => {
  try {
    const deviceData = mockData.find((item: MockDataItem) => item.type === device);
    if (!deviceData) return null;

    const languageSchema = deviceData.languagePageMap[language]?.schema;
    return languageSchema || null;
  } catch (error) {
    console.error("Error getting schema:", error);
    return null;
  }
};

export function generateStaticParams() {
  return mockData.flatMap((item: MockDataItem) =>
    Object.keys(item.languagePageMap).map(lang => ({
      device: item.type,
      language: lang
    }))
  );
}

type PageProps = {
  params: {
    device: string;
    language: string;
  };
};

export default function Page({ params }: PageProps) {
  const { device, language } = params;
  const schema = getSchemaByDeviceAndLanguage(device, language);

  if (!schema) {
    return <div>Page not found</div>;
  }

  return (
    <div suppressHydrationWarning>
      <DesignPage initialData={schema} />
    </div>
  );
}
