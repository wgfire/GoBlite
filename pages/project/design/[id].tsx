import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { Design as PlateDesign } from "@goblit/components";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.params;
  const data = await fetch(`http://localhost:3001/api/design?id=${id}`);
  const schema = await data.json();
  return { props: { designCode: id, schema } };
};
export const Design = (props) => {
  console.log(props);
  useEffect(() => {
    console.log("我是设计页面");
  }, []);

  return (
    <div className="h-full">
      <PlateDesign schema={props.schema}></PlateDesign>
    </div>
  );
};

export default Design;
