import "@go-blite/design/style";
import { Preview } from "@go-blite/design";

const DesignPage: React.FC<{ initialData: object }> = ({ initialData }) => {
  console.log(initialData, "构建数据");

  return (
    <div style={{ width: "100vw", height: "100vh", overflowX: "hidden" }}>
      <Preview schema={initialData} />
    </div>
  );
};
export default DesignPage;
