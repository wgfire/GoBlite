import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { Design as PlateDesign } from "@platform/components";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.params;
  return { props: { designCode: id } };
};
export const Design = (props) => {
  console.log(props);
  useEffect(() => {
    console.log("我是设计页面");
  }, []);

  return (
    <div className="h-full">
      <PlateDesign></PlateDesign>
    </div>
  );
};

export default Design;
