import { DesignProvider, Preview } from "@go-blite/design";

// 确保 initialData 有一个明确的类型，或者至少检查它
const DesignPage = ({ initialData }) => {
  if (!initialData || typeof initialData !== "object" || Object.keys(initialData).length === 0) {
    console.error("DesignPage received invalid or empty initialData:", initialData);
    return <div>Error: Page configuration data is invalid or missing.</div>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, boxSizing: "border-box" }}>
      <DesignProvider
        initialProps={{
          schema: initialData,
          publish: true
        }}
      >
        <Preview />
      </DesignProvider>
    </div>
  );
};

export default DesignPage;
