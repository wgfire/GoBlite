import { useDesignContext } from "@/context";
import { Devices } from "@/context/Provider";
import {
  Button,
  Card,
  CardContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@go-blite/shadcn";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator
} from "@go-blite/shadcn";
import { PanelsRightBottom, LucideHeading5 } from "lucide-react";
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
                height: "3354px",
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
            nodes: [
              "baXw3ioiNX",
              "cbKoL5JK7d",
              "4yxYoZXyt6",
              "HHakc-yk-T",
              "1DY5unCpPs",
              "koOlxpJfW5",
              "DRkFnk4SlS",
              "w_HmLfQcLW",
              "ii3_DnqWHt",
              "1mxlWpVJlD",
              "n4I1oc0OMA",
              "AlGQnO97Bu",
              "u78DzA1bsq",
              "hv8HB3QtGA"
            ],
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
                height: "201px",
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
                left: "0",
                top: "3px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 898,
                width: "100%",
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
                height: "258px",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                borderRadius: 12
              },
              events: {},
              customStyle: {
                position: "relative",
                left: "0px",
                top: "195px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "100%",
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
            nodes: ["CoOjF29WZw", "MraV7wvaD_", "GjV7tOrznU", "-uy_wcBVmT"],
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
                fontSize: "12",
                textAlign: "left",
                fontWeight: "400",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "美国非农业人口就业数据，由美国劳工部在每月第一个星期五公布，<br>是反应美国经济好坏的重要数据指标，<br>可能引发金融市场在短时间内剧烈波动，<br>它被认为是全球经济数据中极重要的讯息",
              customStyle: {
                position: "relative",
                left: "22px",
                top: "84px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
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
                background: "linear-gradient(270deg, #192678 0%, #1942BD 100%)",
                width: "10%",
                height: "93px",
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
                left: "0px",
                top: "451px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "100%",
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
            nodes: ["RbHdsZiFO8", "SuP9n-AT9P"],
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
                padding: 10,
                margin: 0,
                background: "rgba(255, 255, 255, 1)",
                width: "10%",
                height: "543px",
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
                left: "0px",
                top: "496px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 3354,
                width: "100%",
                height: "543px"
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["uTv0w73DHQ", "Dqn3KXSlPe", "OhmxHpZXPR", "Nh9sigpQCh", "3QFRNi3NqV"],
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
                height: "549px",
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
                left: "0",
                top: "1130px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "100%",
                height: "527px",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["6Awo6nllke", "DdaHePEeZm", "L6ZpJ1VxNU"],
            linkedNodes: {}
          },
          "SuP9n-AT9P": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/14/__1b580b33f15504deb.png",
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
                width: "46px",
                height: "39px",
                position: "relative",
                left: "369px",
                top: "4px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 50
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "cbKoL5JK7d",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          w_HmLfQcLW: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "linear-gradient(270deg, #192678 0%, #1942BD 100%)",
                width: "10%",
                height: "93px",
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
                left: "0",
                top: "1080px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "100%",
                height: "50px",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["ips8AmTssC", "_4H-M_P7-Q"],
            linkedNodes: {}
          },
          ips8AmTssC: {
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
            parent: "w_HmLfQcLW",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "_4H-M_P7-Q": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/14/__1b580b33f15504deb.png",
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
                width: "46px",
                height: "39px",
                position: "relative",
                left: "369px",
                top: "4px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 50
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "w_HmLfQcLW",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "6Awo6nllke": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(230, 243, 239, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "103px"
              },
              events: {},
              customStyle: {
                width: "326px",
                height: "73px",
                position: "relative",
                left: "15px",
                top: "20px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 383
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "1DY5unCpPs",
            hidden: false,
            nodes: ["-u51A-6HLF"],
            linkedNodes: {}
          },
          "-u51A-6HLF": {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: "12",
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0,0,0,1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "非农数据好，表示美国经济状况良好<br>， 利多美元，利空黄金",
              customStyle: {
                position: "relative",
                left: "12px",
                top: "17px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 329,
                maxHeight: 107
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "6Awo6nllke",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          L6ZpJ1VxNU: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(246, 231, 234, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "100px"
              },
              events: {},
              customStyle: {
                width: "326px",
                height: "69px",
                position: "relative",
                left: "81px",
                top: "142px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 383
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "1DY5unCpPs",
            hidden: false,
            nodes: ["CPmtkFUtu4"],
            linkedNodes: {}
          },
          CPmtkFUtu4: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: "12",
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(255, 105, 0, 1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "非农数据差，表示美国经济状况萧条，<br>利空美元，利多黄金",
              customStyle: {
                position: "relative",
                left: "23px",
                top: "14px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 326,
                maxHeight: 69
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "L6ZpJ1VxNU",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          DdaHePEeZm: {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/13/People0614db39217b4224.png",
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
                width: "382px",
                height: "252px",
                position: "relative",
                left: "25px",
                top: "247px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 555
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "1DY5unCpPs",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          DRkFnk4SlS: {
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
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "556px"
              },
              events: {},
              customStyle: {
                width: "100%",
                height: "536px",
                position: "relative",
                left: "0px",
                top: "1737px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["feySwp3Kuv", "sW1L1H-Rft", "MxTt80aThw", "a9xK-bovgG", "8oUUe0LBYJ"],
            linkedNodes: {}
          },
          "1mxlWpVJlD": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "linear-gradient(270deg, #192678 0%, #1942BD 100%)",
                width: "10%",
                height: "93px",
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
                left: "0",
                top: "1686px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "100%",
                height: "50px",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["NeBAObx4x9", "FZJiaPw49Z"],
            linkedNodes: {}
          },
          NeBAObx4x9: {
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
              text: "交易黄金或外汇优势",
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
            parent: "1mxlWpVJlD",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          FZJiaPw49Z: {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/14/__1b580b33f15504deb.png",
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
                width: "46px",
                height: "39px",
                position: "relative",
                left: "369px",
                top: "4px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 50
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "1mxlWpVJlD",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "sW1L1H-Rft": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: " https://img.picgo.net/2025/05/13/Group-368458474e8d3053c59ad805.png",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "contain",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "100%",
                height: "156px",
                position: "relative",
                left: "-1px",
                top: "24px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 535
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "DRkFnk4SlS",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          feySwp3Kuv: {
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
              text: "在低价买入黄金",
              customStyle: {
                position: "relative",
                left: "160px",
                top: "204px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 508
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "DRkFnk4SlS",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          MxTt80aThw: {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/13/Group-1000008934978bd121a4433531.png",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "contain",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "100%",
                height: "156px",
                position: "relative",
                left: "0px",
                top: "252px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 508
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "DRkFnk4SlS",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "8oUUe0LBYJ": {
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
              text: "在低价买入黄金",
              customStyle: {
                position: "relative",
                left: "159px",
                top: "438px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 508
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "DRkFnk4SlS",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "a9xK-bovgG": {
            type: {
              resolvedName: "Button"
            },
            isCanvas: false,
            props: {
              style: {
                margin: 0,
                color: "#006CF6",
                borderRadius: 10,
                fontSize: 14,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 108, 246, 0.03)"
              },
              variant: "default",
              size: "default",
              text: "1手黄金利润都是$1800",
              customStyle: {
                position: "relative",
                left: "34px",
                top: "470px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 536,
                width: "82.55813953488372%",
                height: "36px"
              }
            },
            displayName: "Button",
            custom: {
              displayName: "Button"
            },
            parent: "DRkFnk4SlS",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          ii3_DnqWHt: {
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
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "403px"
              },
              events: {},
              customStyle: {
                width: "100%",
                height: "368px",
                position: "relative",
                left: "0",
                top: "2357px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["mtyX8dQA72", "VQPFeiydus", "mdLk2nag5J", "qCKC_9dzZu"],
            linkedNodes: {}
          },
          AlGQnO97Bu: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "linear-gradient(270deg, #192678 0%, #1942BD 100%)",
                width: "10%",
                height: "93px",
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
                left: "0",
                top: "2305px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "100%",
                height: "50px",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["OIHtTvKcnK", "f6jYat4djw"],
            linkedNodes: {}
          },
          OIHtTvKcnK: {
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
              text: "利用杠杆原理",
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
            parent: "AlGQnO97Bu",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          f6jYat4djw: {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/14/__1b580b33f15504deb.png",
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
                width: "46px",
                height: "39px",
                position: "relative",
                left: "369px",
                top: "4px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 50
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "AlGQnO97Bu",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          mtyX8dQA72: {
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
              text: "低成本投资有机会获得高回报",
              customStyle: {
                position: "relative",
                left: "22px",
                top: "15px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 68
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ii3_DnqWHt",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          VQPFeiydus: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(247, 141, 167, 1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "低成本投资有机会获得高回报",
              customStyle: {
                position: "relative",
                left: "43px",
                top: "55px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 268
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ii3_DnqWHt",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          qCKC_9dzZu: {
            type: {
              resolvedName: "Text"
            },
            isCanvas: false,
            props: {
              style: {
                fontSize: 16,
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(142, 209, 252, 1)",
                margin: 0,
                padding: 0,
                shadow: 0
              },
              text: "低成本投资有机会获得高回报",
              customStyle: {
                position: "relative",
                left: "70px",
                top: "99px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 268
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "ii3_DnqWHt",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          mdLk2nag5J: {
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
                objectFit: "contain",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "381px",
                height: "210px",
                position: "relative",
                left: "18px",
                top: "143px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 268
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "ii3_DnqWHt",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          n4I1oc0OMA: {
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
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "447px"
              },
              events: {},
              customStyle: {
                width: "100%",
                height: "420px",
                position: "relative",
                left: "0px",
                top: "2798px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["zG-21TyiN5", "LL70jd27oa", "lt6vr3ASIP", "7ovtXEWjXt", "O_2OTlNiTP"],
            linkedNodes: {}
          },
          hv8HB3QtGA: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "linear-gradient(270deg, #192678 0%, #1942BD 100%)",
                width: "10%",
                height: "93px",
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
                left: "0",
                top: "2748px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "100%",
                height: "50px",
                maxWidth: 430,
                maxHeight: 3354
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "ROOT",
            hidden: false,
            nodes: ["CAwZHgpr4R", "uqHq75q8RW"],
            linkedNodes: {}
          },
          CAwZHgpr4R: {
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
              text: "值得信赖的国际平台",
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
            parent: "hv8HB3QtGA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          uqHq75q8RW: {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/14/__1b580b33f15504deb.png",
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
                width: "46px",
                height: "39px",
                position: "relative",
                left: "369px",
                top: "4px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 50
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "hv8HB3QtGA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "zG-21TyiN5": {
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
              text: "2024-最透明交易平台",
              customStyle: {
                position: "relative",
                left: "28px",
                top: "31px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 250
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "n4I1oc0OMA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          LL70jd27oa: {
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
              text: "2024-最透明交易平台",
              customStyle: {
                position: "relative",
                left: "26px",
                top: "71px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 250
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "n4I1oc0OMA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          lt6vr3ASIP: {
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
              text: "2024-最透明交易平台",
              customStyle: {
                position: "relative",
                left: "27px",
                top: "108px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 250
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "n4I1oc0OMA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "7ovtXEWjXt": {
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
              text: "2024-最透明交易平台",
              customStyle: {
                position: "relative",
                left: "25px",
                top: "145px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 250
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "n4I1oc0OMA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          O_2OTlNiTP: {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/13/b292062a0a7959c7f79985e1b2f5edce03f541447691f2b2.png",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "contain",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "100%",
                height: "210px",
                position: "relative",
                left: "0",
                top: "187px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 420
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "n4I1oc0OMA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          u78DzA1bsq: {
            type: {
              resolvedName: "Button"
            },
            isCanvas: false,
            props: {
              style: {
                margin: 0,
                borderRadius: 40,
                fontSize: 14,
                width: "100%",
                height: "100%"
              },
              variant: "destructive",
              size: "sm",
              text: "领取USD100",
              customStyle: {
                position: "relative",
                left: "28px",
                top: "3241px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                width: "81.86046511627907%",
                maxWidth: 430,
                maxHeight: 3353,
                height: "63px"
              }
            },
            displayName: "Button",
            custom: {
              displayName: "Button"
            },
            parent: "ROOT",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          MraV7wvaD_: {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/13/Group1e0d49d0f2d927790.png",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "contain",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "372px",
                height: "35px",
                position: "relative",
                left: "22.5px",
                top: "173px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 232
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "baXw3ioiNX",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "-uy_wcBVmT": {
            type: {
              resolvedName: "Image"
            },
            isCanvas: false,
            props: {
              src: "https://img.picgo.net/2025/05/13/Group1dca4adb77dbd9e4.png",
              alt: "图片",
              watermark: false,
              style: {
                width: "100%",
                height: "100%",
                objectPosition: "center",
                objectFit: "contain",
                maxWidth: "100vw"
              },
              customStyle: {
                width: "372px",
                height: "35px",
                position: "relative",
                left: "24.5px",
                top: "34px",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 430,
                maxHeight: 232
              }
            },
            displayName: "Image",
            custom: {
              displayName: "Image"
            },
            parent: "baXw3ioiNX",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          OhmxHpZXPR: {
            type: {
              resolvedName: "NonFarm"
            },
            isCanvas: false,
            props: {
              customStyle: {
                position: "relative",
                left: "50px",
                top: "13px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 324
              }
            },
            displayName: "NonFarm",
            custom: {},
            parent: "4yxYoZXyt6",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          uTv0w73DHQ: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "linear-gradient(90deg, #2D58BB 0%, rgba(57, 99, 196, 0.00) 100%)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "83px",
                borderRadius: 6
              },
              events: {},
              customStyle: {
                width: "100%",
                height: "8.221797323135755%",
                position: "relative",
                left: "0px",
                top: "61px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 430,
                maxHeight: 334
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "4yxYoZXyt6",
            hidden: false,
            nodes: ["bQGah4wS3m"],
            linkedNodes: {}
          },
          bQGah4wS3m: {
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
              text: "10月4日",
              customStyle: {
                position: "relative",
                left: "21px",
                top: "9px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 410,
                maxHeight: 38
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "uTv0w73DHQ",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          Dqn3KXSlPe: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(242, 247, 254, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "178px",
                borderRadius: 20
              },
              events: {},
              customStyle: {
                width: "99.26829268292683%",
                height: "28.87189292543021%",
                position: "relative",
                left: "0.5px",
                top: "111px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 533
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "4yxYoZXyt6",
            hidden: false,
            nodes: ["kbIgPKZ_fc", "0lAluccndN", "63LMNI6o-_", "rzCsTe1gcA"],
            linkedNodes: {}
          },
          "0lAluccndN": {
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
              text: "新增25.4万",
              customStyle: {
                position: "relative",
                left: "16px",
                top: "17px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 189
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "Dqn3KXSlPe",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          kbIgPKZ_fc: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(237, 237, 237, 0)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "80px"
              },
              events: {},
              customStyle: {
                width: "41.76904176904177%",
                height: "18.51851851851852%",
                position: "relative",
                left: "13px",
                top: "53px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 189
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "Dqn3KXSlPe",
            hidden: false,
            nodes: ["sD0u48s3s_", "IdA7ZS-gjG"],
            linkedNodes: {}
          },
          sD0u48s3s_: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(5, 99, 237, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "50px"
              },
              events: {},
              customStyle: {
                width: "2.3529411764705883%",
                height: "45.714285714285715%",
                position: "relative",
                left: "6px",
                top: "12px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "kbIgPKZ_fc",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "IdA7ZS-gjG": {
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
              text: "数值高于预期",
              customStyle: {
                position: "relative",
                left: "25px",
                top: "6px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "kbIgPKZ_fc",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "63LMNI6o-_": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(237, 237, 237, 0)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "80px"
              },
              events: {},
              customStyle: {
                width: "41.76904176904177%",
                height: "18.51851851851852%",
                position: "relative",
                left: "191px",
                top: "55px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 189
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "Dqn3KXSlPe",
            hidden: false,
            nodes: ["4k5rMqgvxg", "xcvSvpd1v4"],
            linkedNodes: {}
          },
          "4k5rMqgvxg": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(5, 99, 237, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "50px"
              },
              events: {},
              customStyle: {
                width: "2.3529411764705883%",
                height: "45.714285714285715%",
                position: "relative",
                left: "6px",
                top: "12px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "63LMNI6o-_",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          xcvSvpd1v4: {
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
              text: "美元指数上涨60点",
              customStyle: {
                position: "relative",
                left: "25px",
                top: "6px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "63LMNI6o-_",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          rzCsTe1gcA: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(237, 237, 237, 0)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "80px"
              },
              events: {},
              customStyle: {
                width: "41.76904176904177%",
                height: "18.51851851851852%",
                position: "relative",
                left: "15px",
                top: "100px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 162
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "Dqn3KXSlPe",
            hidden: false,
            nodes: ["baCdf8mEit", "J-xSrj-H3O"],
            linkedNodes: {}
          },
          baCdf8mEit: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(5, 99, 237, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "50px"
              },
              events: {},
              customStyle: {
                width: "2.3529411764705883%",
                height: "45.714285714285715%",
                position: "relative",
                left: "6px",
                top: "12px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "rzCsTe1gcA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "J-xSrj-H3O": {
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
              text: "金价下跌18美金",
              customStyle: {
                position: "relative",
                left: "25px",
                top: "6px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "rzCsTe1gcA",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          Nh9sigpQCh: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "linear-gradient(90deg, #2D58BB 0%, rgba(57, 99, 196, 0.00) 100%)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "83px",
                borderRadius: 6
              },
              events: {},
              customStyle: {
                width: "100%",
                height: "8.221797323135755%",
                position: "relative",
                left: "-1px",
                top: "292px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 533
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "4yxYoZXyt6",
            hidden: false,
            nodes: ["w7J15HR5Yu"],
            linkedNodes: {}
          },
          w7J15HR5Yu: {
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
              text: "11月1日",
              customStyle: {
                position: "relative",
                left: "21px",
                top: "9px",
                transform: "none",
                zIndex: "auto",
                justifySelf: "start",
                alignSelf: "start",
                willChange: "none",
                maxWidth: 410,
                maxHeight: 38
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "Nh9sigpQCh",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "3QFRNi3NqV": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(242, 247, 254, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "178px",
                borderRadius: 20
              },
              events: {},
              customStyle: {
                width: "99.26829268292683%",
                height: "28.87189292543021%",
                position: "relative",
                left: "-2.5px",
                top: "342px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 420,
                maxHeight: 533
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "4yxYoZXyt6",
            hidden: false,
            nodes: ["Xix9VxAXs1", "Rcfho3bwEq", "10kg5-d73_", "2wJ9W8BB0B"],
            linkedNodes: {}
          },
          Xix9VxAXs1: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(237, 237, 237, 0)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "80px"
              },
              events: {},
              customStyle: {
                width: "41.76904176904177%",
                height: "18.51851851851852%",
                position: "relative",
                left: "13px",
                top: "53px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 189
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "3QFRNi3NqV",
            hidden: false,
            nodes: ["aC4rCJIecp", "t-6RctaLjq"],
            linkedNodes: {}
          },
          aC4rCJIecp: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(5, 99, 237, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "50px"
              },
              events: {},
              customStyle: {
                width: "2.3529411764705883%",
                height: "45.714285714285715%",
                position: "relative",
                left: "6px",
                top: "12px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "Xix9VxAXs1",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "t-6RctaLjq": {
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
              text: "数值低于预期",
              customStyle: {
                position: "relative",
                left: "25px",
                top: "6px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "Xix9VxAXs1",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          Rcfho3bwEq: {
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
              text: "新增1.2万",
              customStyle: {
                position: "relative",
                left: "16px",
                top: "17px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 189
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "3QFRNi3NqV",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "10kg5-d73_": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(237, 237, 237, 0)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "80px"
              },
              events: {},
              customStyle: {
                width: "41.76904176904177%",
                height: "18.51851851851852%",
                position: "relative",
                left: "191px",
                top: "55px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 189
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "3QFRNi3NqV",
            hidden: false,
            nodes: ["xJzqh4si_m", "tiB0Ad14DA"],
            linkedNodes: {}
          },
          xJzqh4si_m: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(5, 99, 237, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "50px"
              },
              events: {},
              customStyle: {
                width: "2.3529411764705883%",
                height: "45.714285714285715%",
                position: "relative",
                left: "6px",
                top: "12px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "10kg5-d73_",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          tiB0Ad14DA: {
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
              text: "美元指数下跌30点",
              customStyle: {
                position: "relative",
                left: "25px",
                top: "6px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "10kg5-d73_",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "2wJ9W8BB0B": {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(237, 237, 237, 0)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "80px"
              },
              events: {},
              customStyle: {
                width: "41.76904176904177%",
                height: "18.51851851851852%",
                position: "relative",
                left: "15px",
                top: "100px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 407,
                maxHeight: 162
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "3QFRNi3NqV",
            hidden: false,
            nodes: ["VPkkyCGTCr", "-ZWKu07Qn1"],
            linkedNodes: {}
          },
          VPkkyCGTCr: {
            type: {
              resolvedName: "Container"
            },
            isCanvas: true,
            props: {
              style: {
                display: "grid",
                padding: 0,
                margin: 0,
                background: "rgba(5, 99, 237, 0.8)",
                backgroundImage: "none",
                gridArea: "1 / 1 / 2 / 2",
                gridTemplateRows: "minmax(0px, 100%)",
                gridTemplateColumns: "minmax(0px, 1fr)",
                flexDirection: "row",
                maxHeight: 100000,
                maxWidth: 100000,
                width: "10%",
                height: "50px"
              },
              events: {},
              customStyle: {
                width: "2.3529411764705883%",
                height: "45.714285714285715%",
                position: "relative",
                left: "6px",
                top: "12px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "matrix(1, 0, 0, 1, 0, 0)",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              },
              animation: []
            },
            displayName: "Container",
            custom: {
              displayName: "Container"
            },
            parent: "2wJ9W8BB0B",
            hidden: false,
            nodes: [],
            linkedNodes: {}
          },
          "-ZWKu07Qn1": {
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
              text: "金价上涨10美金",
              customStyle: {
                position: "relative",
                left: "25px",
                top: "6px",
                justifySelf: "start",
                alignSelf: "start",
                transform: "none",
                willChange: "none",
                zIndex: "auto",
                maxWidth: 170,
                maxHeight: 35
              }
            },
            displayName: "Text",
            custom: {
              displayName: "Text"
            },
            parent: "2wJ9W8BB0B",
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
export const Layout: React.FC = () => {
  const template = [
    {
      type: "static-download",
      name: "非农活动专题",
      icon: <LucideHeading5 />,
      template: devices
    }
  ];
  const { updateContext, currentInfo } = useDesignContext();

  const clickTemplate = (item: (typeof template)[0]) => {
    const schema = item.template.find(el => el.type === currentInfo.device)?.languagePageMap[currentInfo.language]
      ?.schema;
    console.log(schema, "schema");
    updateContext(draft => {
      draft.device = item.template;
      draft.schema = schema;
    });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="flex items-center justify-center">
                <PanelsRightBottom className="w-4 h-4 mr-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">页面模版</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent side="right" className="translate-x-2 translate-y-2">
        <Command className="rounded-lg border">
          <CommandInput placeholder="模版搜索" />
          <CommandList className="max-h-[60vh] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>

            <>
              <CommandGroup heading={"模版"}>
                <CommandItem>
                  <Card className="cursor-pointer flex gap-2">
                    {template.map(item => {
                      return (
                        <CardContent
                          onClick={() => clickTemplate(item)}
                          key={item.type}
                          className="p-2 flex flex-col items-center justify-center gap-2 max-w-[80px]"
                        >
                          <div>{item.icon}</div>
                          <span className="text-xs mt-1 text-center truncate w-full text-ellipsis">{item.name}</span>
                        </CardContent>
                      );
                    })}
                  </Card>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
