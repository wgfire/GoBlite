import React, { useMemo } from "react";
import { Design } from "../src/editor/Design";
import { DesignProvider, useDesignContext } from "../src/context";
import { DesignContextProps } from "@/context/Provider";
import { devices } from "./mock";

const DemoContent: React.FC = () => {
  const contextData = useDesignContext();

  console.log(contextData, "Design context data");

  return <Design />;
};

export const DemoPage: React.FC = () => {
  const Login = () => <div>Login</div>;

  const initialProps = useMemo<Partial<DesignContextProps>>(
    () => ({
      device: devices,
      schema: devices[0].languagePageMap["zh"].schema,
      resolver: {
        Login: Login
      },

      assets: [
        {
          name: "icon",
          url: "https://img.picgo.net/2025/05/14/__1b580b33f15504deb.png",
          type: "Image"
        },
        {
          name: "people",
          url: "https://img.picgo.net/2025/05/13/People0614db39217b4224.png",
          type: "Image"
        },
        {
          name: "people1",
          url: " https://img.picgo.net/2025/05/13/Group-368458474e8d3053c59ad805.png",
          type: "Image"
        },
        {
          name: "people2",
          url: "https://img.picgo.net/2025/05/13/Group-1000008934978bd121a4433531.png",
          type: "Image"
        },
        {
          name: "banner",
          url: "https://img.picgo.net/2025/05/13/b292062a0a7959c7f79985e1b2f5edce03f541447691f2b2.png",
          type: "Image"
        },
        {
          name: "banner1",
          url: "https://img.picgo.net/2025/05/13/Group1e0d49d0f2d927790.png",
          type: "Image"
        },
        {
          name: "banner2",
          url: "https://img.picgo.net/2025/05/13/Group1dca4adb77dbd9e4.png",
          type: "Image"
        },
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
      publish: false
    }),
    []
  );
  return (
    <DesignProvider initialProps={initialProps}>
      <DemoContent />
    </DesignProvider>
  );
};
