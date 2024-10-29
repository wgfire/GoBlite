import DesignPage from "./Client";

const ServerComponent = async () => {
  const res = await fetch("http://localhost:3000/api/design");
  const data = await res.json();
  console.log(data, "data");

  return <DesignPage initialData={data} />;
};
export default ServerComponent;
