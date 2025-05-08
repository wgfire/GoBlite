import React, { useMemo } from "react";
import { Design } from "../src/editor/Design";
import { DesignProvider, useDesignContext } from "../src/context";
import { DesignContextProps, Devices } from "@/context/Provider";
const devices: Devices = [
  {
    type: "desktop",
    pageTemplate: "static-download",
    languagePageMap: {
      zh: {
        schema: {
          ROOT: {
            type: {
              resolvedName: "App"
            },
            isCanvas: true,
            props: {
              events: {},
              customStyle: {
                position: "relative",
                left: "0%",
                top: "0%",
                willChange: "none",
                zIndex: "auto"
              },
              animation: []
            },
            displayName: "App",
            custom: {
              displayName: "App"
            },
            parent: null,
            hidden: false,
            nodes: ["x9MNS_sqdX", "5ukynhPwxL", "BA206XItNz"],
            linkedNodes: {}
          },
          BA206XItNz: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文本",
              customStyle: {
                position: "relative",
                left: "41.96784787061738%",
                top: "9.119496855345911%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          x9MNS_sqdX: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文反反复复<div>测试</div><div>测试文本</div><div>测试</div>",
              customStyle: {
                position: "relative",
                left: "16.477274080602132%",
                top: "16.33076217939269%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "5ukynhPwxL": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2024/10/23/img_pc_tittle2x583c1c2e2317cc27.webp",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "cover",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "266px",
                height: "100px",
                position: "relative",
                left: "16.363637040301068%",
                top: "38.429101907982016%",
                willChange: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          }
        }
      }
    }
  },
  {
    type: "mobile",
    pageTemplate: "static-download",
    languagePageMap: {
      zh: {
        schema: {
          ROOT: {
            type: {
              resolvedName: "App"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "1fr",
                gridAutoRows: "minmax(0px,100%)",
                gap: "10px",
                padding: 10,
                height: "394.54499999999996px",
                minHeight: "100%",
                minWidth: "100%",
                width: "auto",
                flexDirection: "column",
                background: "rgba(255,255,255,1)",
                alignContent: "flex-start",
                position: "relative"
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "0%",
                top: "0%",
                willChange: "none",
                zIndex: "auto"
              },
              animation: []
            },
            displayName: "App",
            custom: {
              displayName: "App"
            },
            parent: null,
            hidden: false,
            nodes: ["x9MNS_sqdX", "5ukynhPwxL", "BA206XItNz"],
            linkedNodes: {}
          },
          BA206XItNz: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文本",
              customStyle: {
                position: "relative",
                left: "41.96784787061738%",
                top: "9.119496855345911%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          x9MNS_sqdX: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文反反复复<div>测试</div><div>测试文本</div><div>测试</div>",
              customStyle: {
                position: "relative",
                left: "16.477274080602132%",
                top: "16.33076217939269%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "5ukynhPwxL": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2024/10/23/img_pc_tittle2x583c1c2e2317cc27.webp",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "cover",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "266px",
                height: "100px",
                position: "relative",
                left: "16.363637040301068%",
                top: "38.429101907982016%",
                willChange: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          }
        }
      },
      en: {
        schema: {
          ROOT: {
            type: {
              resolvedName: "App"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "1fr",
                gridAutoRows: "minmax(0px,100%)",
                gap: "10px",
                padding: 10,
                height: "412.352px",
                minHeight: "100%",
                minWidth: "100%",
                width: "auto",
                flexDirection: "column",
                background: "rgba(255,255,255,1)",
                alignContent: "flex-start",
                position: "relative"
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "0%",
                top: "0%",
                willChange: "none",
                zIndex: "auto"
              },
              animation: []
            },
            displayName: "App",
            custom: {
              displayName: "App"
            },
            parent: null,
            hidden: false,
            nodes: ["x9MNS_sqdX", "wqCUS7_-VY", "BA206XItNz"],
            linkedNodes: {}
          },
          BA206XItNz: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文本",
              customStyle: {
                position: "relative",
                left: "41.96784787061738%",
                top: "9.119496855345911%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          x9MNS_sqdX: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文反反复复<div>测试</div><div>测试文本</div><div>测试</div>",
              customStyle: {
                position: "relative",
                left: "16.477274080602132%",
                top: "16.33076217939269%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "wqCUS7_-VY": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2024/10/23/img_pc_banenr2x5ad243cc2e2ce7df.webp",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "fill",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "340px",
                height: "100px",
                position: "relative",
                left: "8.306542373285062%",
                top: "41.22829774026886%",
                willChange: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                maxWidth: 420,
                maxHeight: 633
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          }
        }
      },
      vn: {
        schema: {
          ROOT: {
            type: {
              resolvedName: "App"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "1fr",
                gridAutoRows: "minmax(0px,100%)",
                gap: "10px",
                padding: 0,
                height: "633.773px",
                minHeight: "100%",
                minWidth: "100%",
                width: "auto",
                flexDirection: "column",
                background: "rgba(255,255,255,1)",
                alignContent: "flex-start",
                position: "relative"
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "0%",
                top: "0%",
                willChange: "none",
                zIndex: "auto"
              },
              animation: []
            },
            displayName: "App",
            custom: {
              displayName: "App"
            },
            parent: null,
            hidden: false,
            nodes: ["x9MNS_sqdX", "wqCUS7_-VY", "BA206XItNz", "e2B78uBP4q", "7r5xR_-sgf"],
            linkedNodes: {}
          },
          BA206XItNz: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文本",
              customStyle: {
                position: "relative",
                left: "41.966176587481826%",
                top: "9.123823119372856%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          x9MNS_sqdX: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文反反复复<div>测试</div><div>测试文本</div><div>测试</div>",
              customStyle: {
                position: "relative",
                left: "16.482565236646078%",
                top: "16.35601462387457%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "wqCUS7_-VY": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2024/10/23/img_pc_banenr2x5ad243cc2e2ce7df.webp",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "fill",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "364px",
                height: "100px",
                position: "relative",
                left: "6.797045330668605%",
                top: "36.931819450564504%",
                willChange: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                maxWidth: 406,
                maxHeight: 661
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          e2B78uBP4q: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: "20",
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文反反复复<div>测试</div><div>测试文本</div><div>测试</div>",
              customStyle: {
                position: "relative",
                left: "7.341443438862645%",
                top: "59.03894377917778%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 406,
                maxHeight: 661,
                transform: "none"
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "7r5xR_-sgf": {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文反反复复<div>测试</div><div>测试文本</div><div>测试</div>",
              customStyle: {
                position: "relative",
                left: "6.8763271597928775%",
                top: "74.31575496022295%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          }
        }
      }
    }
  },
  {
    type: "tablet",
    pageTemplate: "static-download",
    languagePageMap: {
      zh: {
        schema: {
          ROOT: {
            type: {
              resolvedName: "App"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "1fr",
                gridAutoRows: "minmax(0px,100%)",
                gap: "10px",
                padding: 10,
                height: "394.54499999999996px",
                minHeight: "100%",
                minWidth: "100%",
                width: "auto",
                flexDirection: "column",
                background: "rgba(255,255,255,1)",
                alignContent: "flex-start",
                position: "relative"
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "0%",
                top: "0%",
                willChange: "none",
                zIndex: "auto"
              },
              animation: []
            },
            displayName: "App",
            custom: {
              displayName: "App"
            },
            parent: null,
            hidden: false,
            nodes: ["x9MNS_sqdX", "5ukynhPwxL", "BA206XItNz"],
            linkedNodes: {}
          },
          BA206XItNz: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文本",
              customStyle: {
                position: "relative",
                left: "41.96784787061738%",
                top: "9.119496855345911%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          x9MNS_sqdX: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文反反复复<div>测试</div><div>测试文本</div><div>测试</div>",
              customStyle: {
                position: "relative",
                left: "16.477274080602132%",
                top: "16.33076217939269%",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "5ukynhPwxL": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2024/10/23/img_pc_tittle2x583c1c2e2317cc27.webp",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "cover",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "266px",
                height: "100px",
                position: "relative",
                left: "16.363637040301068%",
                top: "38.429101907982016%",
                willChange: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                maxWidth: 420,
                maxHeight: 646
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          }
        }
      }
    }
  }
];
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
