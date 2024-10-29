"use client";
import React, { useMemo } from "react";
import "@go-blite/design/style";
import { Design, DesignProvider } from "@go-blite/design";

// const getDesignData = async () => {
//   const data = await fetch("/api/design");
//   console.log(data.json(), "数据");
//   return data.json();
// };

const DesignPage: React.FC<{ initialData: object }> = ({ initialData }) => {
  console.log(initialData);

  const Login = () => <div>Login</div>;

  const initialProps = useMemo(
    () => ({
      device: initialData,
      schema: initialData[0].languagePageMap["zh"].schema,
      resolver: {
        Login: Login
      },
      assets: [
        {
          name: "pc_content1",
          url: "  https://img.picgo.net/2024/10/23/img_pc_022x2d931e6b91c97a45.webp",
          type: "Image"
        },
        {
          name: "pc_content2",
          url: "  https://img.picgo.net/2024/10/23/img_pc_032xd2ee4342931d8a8b.webp",
          type: "Image"
        },
        {
          name: "pc_banner",
          url: "https://img.picgo.net/2024/10/23/img_pc_banenr2x5ad243cc2e2ce7df.webp",
          type: "Image"
        },
        {
          name: "pc_tip",
          url: "  https://img.picgo.net/2024/10/23/img_pc_tip2xd211e95a6fd89c44.webp",
          type: "Image"
        },
        {
          name: "pc_title",
          url: "https://img.picgo.net/2024/10/23/img_pc_tittle2x583c1c2e2317cc27.webp",
          type: "Image"
        },
        {
          name: "h5_button",
          url: "https://img.picgo.net/2024/10/24/h5_button2xe38897f7a76c9676.webp",
          type: "Image"
        },
        {
          name: "h5_content1",
          url: "https://img.picgo.net/2024/10/24/img_h5_012x6cfdf4b3738e6f4e.webp",
          type: "Image"
        },
        {
          name: "h5_content2",
          url: "https://img.picgo.net/2024/10/24/img_h5_022x109861144e905598.webp",
          type: "Image"
        },
        {
          name: "h5_content3",
          url: "https://img.picgo.net/2024/10/24/img_h5_032x1f53ec28a4f7dfe7.webp",
          type: "Image"
        },
        {
          name: "h5_tip",
          url: "https://img.picgo.net/2024/10/24/img_h5_tip2x7e782f93b2f91f3d.webp",
          type: "Image"
        },
        {
          name: "ipad_content1",
          url: "https://img.picgo.net/2024/10/24/img_ipad_012xac40401d5b8f8b3d.webp",
          type: "Image"
        },
        {
          name: "ipad_content2",
          url: "https://img.picgo.net/2024/10/24/img_ipad_022xe6c479cbe561a790.webp",
          type: "Image"
        },
        {
          name: "ipad_content3",
          url: "https://img.picgo.net/2024/10/24/img_ipad_032xca2918e8da7bce0e.webp",
          type: "Image"
        },
        {
          name: "ipad_tip",
          url: "https://img.picgo.net/2024/10/24/img_ipad_tip2x73afbdd180616856.webp",
          type: "Image"
        },
        {
          name: "ipad_button",
          url: "https://img.picgo.net/2024/10/24/ipad_button2xf60de74754ae81df.webp",
          type: "Image"
        }
      ],
      publish: true
    }),
    []
  );
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DesignProvider initialProps={initialProps}>
        <Design />
      </DesignProvider>
    </div>
  );
};
export default DesignPage;
