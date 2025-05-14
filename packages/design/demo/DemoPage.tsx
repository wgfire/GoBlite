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
              style: {
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "1fr",
                gridAutoRows: "minmax(0px,100%)",
                padding: 10,
                height: "487.406px",
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
                left: "0px",
                top: "0px",
                willChange: "none",
                zIndex: "auto",
                transform: "none",
                justifySelf: "start",
                alignSelf: "start"
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
                padding: 0,
                height: "1334px",
                minHeight: "100%",
                minWidth: "100%",
                width: "auto",
                flexDirection: "column",
                background: "rgba(0, 8, 25, 1)",
                alignContent: "flex-start",
                position: "relative",
                margin: 0
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "0px",
                top: "0px",
                willChange: "none",
                zIndex: "auto",
                transform: "none",
                justifySelf: "start",
                alignSelf: "start"
              },
              animation: []
            },
            displayName: "App",
            custom: {
              displayName: "App"
            },
            parent: null,
            hidden: false,
            nodes: ["baXw3ioiNX", "cbKoL5JK7d", "4yxYoZXyt6", "DqAo11cWoh", "HHakc-yk-T", "1DY5unCpPs", "koOlxpJfW5"],
            linkedNodes: {}
          },
          koOlxpJfW5: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(237, 237, 237, 0.8)",
                width: "11px",
                height: "",
                backgroundImage:
                  "https://img.picgo.net/2025/05/13/b292062a0a7959c7f79985e1b2f5edce03f541447691f2b2.png",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "5px",
                top: "3px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 898,
                width: "420px",
                height: "176px"
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["OCl6kK5UZo", "lQCkMQFT8a"],
            linkedNodes: {}
          },
          lQCkMQFT8a: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: "23.8333px",
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(252, 185, 0, 1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "文本",
              customStyle: {
                position: "relative",
                left: "18px",
                top: "36px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 420,
                maxHeight: 176
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "koOlxpJfW5",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          OCl6kK5UZo: {
            type: {
              resolvedName: "Button"
            },
            isCanvas: false,
            props: {
              style: {
                margin: 0,
                borderRadius: 24,
                fontSize: 14,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(5, 99, 237)"
              },
              variant: "default",
              size: "default",
              text: "立即领取",
              customStyle: {
                position: "relative",
                left: "14px",
                top: "115px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 420,
                maxHeight: 176,
                width: "93px",
                height: "36px"
              }
            },
            displayName: "Button",
            custom: {
              displayName: "Button"
            },
            parent: "koOlxpJfW5",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          baXw3ioiNX: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(255 255, 255, 1)",
                width: "100%",
                height: "10%",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "15px",
                top: "195px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "404px",
                height: "232px",
                maxWidth: 430,
                maxHeight: 898
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["CoOjF29WZw", "GjV7tOrznU"],
            linkedNodes: {}
          },
          GjV7tOrznU: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: "16.2281px",
                textAlign: "left",
                fontWeight: "500",
                color: "#001F6F",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "为什么要关注非农",
              customStyle: {
                position: "relative",
                left: "15px",
                top: "9px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 420,
                maxHeight: 167
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "baXw3ioiNX",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          CoOjF29WZw: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: "17.5739px",
                textAlign: "left",
                fontWeight: "400",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "美国非农业人口就业数据，<br>由美国劳工部在每月第一个星期五公布，<br>是反应美国经济好坏的重要数据指标，<br>可能引发金融市场在短时间内剧烈波动，<br>它被认为是全球经济数据中极重要的讯息",
              customStyle: {
                position: "relative",
                left: "16px",
                top: "52px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 398,
                maxHeight: 232
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "baXw3ioiNX",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          cbKoL5JK7d: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(20, 45, 132)",
                width: "10%",
                height: "10%",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "16px",
                top: "451px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "402px",
                height: "50px",
                maxWidth: 430,
                maxHeight: 898
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["RbHdsZiFO8"],
            linkedNodes: {}
          },
          RbHdsZiFO8: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(255, 255, 255, 1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "非农公布倒计时",
              customStyle: {
                position: "relative",
                left: "16px",
                top: "13px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 398,
                maxHeight: 49
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "cbKoL5JK7d",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "4yxYoZXyt6": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(255, 255, 255, 1)",
                width: "10%",
                height: "10%",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "16px",
                top: "496px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 898,
                width: "401px",
                height: "334px"
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          DqAo11cWoh: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(17, 42, 117)",
                width: "10%",
                height: "10%",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "15px",
                top: "852px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "401px",
                height: "49px",
                maxWidth: 430,
                maxHeight: 1335
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["vMLK-i3j7m"],
            linkedNodes: {}
          },
          "HHakc-yk-T": {
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
                left: "15px",
                top: "9px"
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
          "vMLK-i3j7m": {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(255, 255, 255, 1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "非农如何影响市场",
              customStyle: {
                position: "relative",
                left: "15px",
                top: "15px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 394,
                maxHeight: 49
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "DqAo11cWoh",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "1DY5unCpPs": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(255, 255, 255, 1)",
                width: "10%",
                height: "10%",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "15px",
                top: "901px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "401px",
                height: "383px",
                maxWidth: 430,
                maxHeight: 1335
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
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
                padding: 10,
                height: "487.406px",
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
const schema = localStorage.getItem("mobile");
if (schema) {
  devices[1].languagePageMap["zh"].schema = JSON.parse(schema!);
}

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
