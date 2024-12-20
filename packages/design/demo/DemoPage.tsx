import React, { useMemo } from "react";
import { Design } from "../src/editor/Design";
import { DesignProvider, useDesignContext } from "../src/context";
import { DesignContextProps } from "@/context/Provider";
const mockSchema = {
  ROOT: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      display: "flex",
      events: {},
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      fillSpace: "no",
      padding: 10,
      margin: 0,
      background: "rgba(255, 255, 255, 1)",
      width: "100%",
      height: "auto",
      backgroundImage: "none",
      customStyle: {
        transform: "translate(0px, 0px)"
      },
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      shadow: 0,
      radius: 0,
      gap: 24
    },
    displayName: "Container",
    custom: {
      displayName: "App"
    },
    hidden: false,
    nodes: ["gzsEdhIaot", "_p4zH0Iiru", "YwGGHTeYv6", "1G8NiWdS4Q"],
    linkedNodes: {},
    parent: null
  },
  "6BTUHH35yt": {
    type: {
      resolvedName: "Image"
    },
    isCanvas: false,
    props: {
      src: "https://img.picgo.net/2024/10/23/img_pc_tittle2x583c1c2e2317cc27.webp",
      alt: "pc_title",
      width: "360px",
      height: "120px",
      objectFit: "cover",
      maxWidth: "100%"
    },
    displayName: "Image",
    custom: {
      displayName: "Image"
    },
    parent: "ScZWfRnaSF",
    hidden: false,
    nodes: [],
    linkedNodes: {}
  },
  boZnVaqIIJ: {
    type: {
      resolvedName: "Image"
    },
    isCanvas: false,
    props: {
      src: "https://img.picgo.net/2024/10/23/img_pc_banenr2x5ad243cc2e2ce7df.webp",
      alt: "pc_banner",
      width: "480",
      height: "416",
      objectFit: "contain",
      maxWidth: "100%"
    },
    displayName: "Image",
    custom: {
      displayName: "Image"
    },
    parent: "ScZWfRnaSF",
    hidden: false,
    nodes: [],
    linkedNodes: {}
  },
  gzsEdhIaot: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      display: "flex",
      events: {},
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fillSpace: "no",
      padding: 0,
      margin: 0,
      background: "linear-gradient(171deg, #1146CF -2.51%,#247AFF 42.82%,#23BDFF 95.06%)",
      width: "100%",
      height: "670px",
      backgroundImage: "none",
      customStyle: {
        transform: "translate(0px, 0px)"
      },
      gap: 0
    },
    displayName: "Container",
    custom: {
      displayName: "Container"
    },
    parent: "ROOT",
    hidden: false,
    nodes: ["ScZWfRnaSF", "InWF2kg58A"],
    linkedNodes: {}
  },
  ScZWfRnaSF: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      display: "flex",
      events: {},
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
      fillSpace: "no",
      padding: 0,
      margin: 0,
      background: "rgba(255, 255, 255, 0)",
      width: "100%",
      height: "100%",
      backgroundImage: "none",
      customStyle: {
        transform: "translate(0px, 0px)"
      }
    },
    displayName: "Container",
    custom: {
      displayName: "Container"
    },
    parent: "gzsEdhIaot",
    hidden: false,
    nodes: ["6BTUHH35yt", "boZnVaqIIJ"],
    linkedNodes: {}
  },
  InWF2kg58A: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      display: "flex",
      events: {},
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      fillSpace: "no",
      padding: 0,
      margin: 0,
      background: "rgba(142, 209, 252, 0)",
      width: "100%",
      height: "100%",
      backgroundImage: "none",
      customStyle: {
        transform: "translate(0px, 0px)"
      }
    },
    displayName: "Container",
    custom: {
      displayName: "Container"
    },
    parent: "gzsEdhIaot",
    hidden: false,
    nodes: ["ZAcKgWgIor"],
    linkedNodes: {}
  },
  ZAcKgWgIor: {
    type: {
      resolvedName: "Button"
    },
    isCanvas: false,
    props: {
      color: "rgba(255, 255, 255, 1)",
      buttonStyle: "full",
      text: "我是登录的业务组件",
      margin: 0
    },
    displayName: "Button",
    custom: {
      displayName: "Button"
    },
    parent: "InWF2kg58A",
    hidden: false,
    nodes: [],
    linkedNodes: {}
  },
  RIj6ZI_aJ2: {
    type: {
      resolvedName: "Image"
    },
    isCanvas: false,
    props: {
      src: "  https://img.picgo.net/2024/10/23/img_pc_022x2d931e6b91c97a45.webp",
      alt: "pc_content1",
      width: "1200px",
      height: "auto",
      objectFit: "cover",
      maxWidth: "100%"
    },
    displayName: "Image",
    custom: {
      displayName: "Image"
    },
    parent: "_p4zH0Iiru",
    hidden: false,
    nodes: [],
    linkedNodes: {}
  },
  _p4zH0Iiru: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      display: "flex",
      events: {},
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fillSpace: "no",
      padding: 48,
      margin: 0,
      background: "rgba(255, 255, 255, 0.1)",
      width: "100%",
      height: "auto",
      backgroundImage: "none",
      customStyle: {
        transform: "translate(0px, 32px)"
      }
    },
    displayName: "Container",
    custom: {
      displayName: "Container"
    },
    parent: "ROOT",
    hidden: false,
    nodes: ["RIj6ZI_aJ2"],
    linkedNodes: {}
  },
  YwGGHTeYv6: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      display: "flex",
      events: {},
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fillSpace: "no",
      padding: 48,
      margin: 0,
      background: "#F2F5F7",
      width: "100%",
      height: "auto",
      backgroundImage: "none",
      customStyle: {
        transform: "translate(0px, 0px)"
      }
    },
    displayName: "Container",
    custom: {
      displayName: "Container"
    },
    parent: "ROOT",
    hidden: false,
    nodes: ["Nl8sjq6U1I"],
    linkedNodes: {}
  },
  "1G8NiWdS4Q": {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      display: "flex",
      events: {},
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fillSpace: "no",
      padding: 48,
      margin: 0,
      background: "rgba(255, 255, 255, 0.1)",
      width: "100%",
      height: "auto",
      backgroundImage: "none",
      customStyle: {
        transform: "translate(0px, 0px)"
      }
    },
    displayName: "Container",
    custom: {
      displayName: "Container"
    },
    parent: "ROOT",
    hidden: false,
    nodes: ["YTERRMBA7x"],
    linkedNodes: {}
  },
  Nl8sjq6U1I: {
    type: {
      resolvedName: "Image"
    },
    isCanvas: false,
    props: {
      src: "  https://img.picgo.net/2024/10/23/img_pc_032xd2ee4342931d8a8b.webp",
      alt: "pc_content2",
      width: "1200px",
      height: "auto",
      objectFit: "cover",
      maxWidth: "100%"
    },
    displayName: "Image",
    custom: {
      displayName: "Image"
    },
    parent: "YwGGHTeYv6",
    hidden: false,
    nodes: [],
    linkedNodes: {}
  },
  YTERRMBA7x: {
    type: {
      resolvedName: "Image"
    },
    isCanvas: false,
    props: {
      src: "  https://img.picgo.net/2024/10/23/img_pc_tip2xd211e95a6fd89c44.webp",
      alt: "pc_tip",
      width: "1200px",
      height: "auto",
      objectFit: "cover",
      maxWidth: "100%"
    },
    displayName: "Image",
    custom: {
      displayName: "Image"
    },
    parent: "1G8NiWdS4Q",
    hidden: false,
    nodes: [],
    linkedNodes: {}
  }
};
const DemoContent: React.FC = () => {
  const contextData = useDesignContext();

  console.log(contextData, "Design context data");

  return <Design />;
};

export const DemoPage: React.FC = () => {
  const Login = () => <div>Login</div>;

  const initialProps = useMemo<Partial<DesignContextProps>>(
    () => ({
      device: [
        {
          type: "desktop",
          pageTemplate: "static-download",
          languagePageMap: {
            zh: {
              schema: mockSchema
            }
          }
        }
      ],
      schema: undefined,
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
