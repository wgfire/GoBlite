import { CustomApiType } from "../types";

/**
 * 自定义API示例
 */
export const nativeAppApis: CustomApiType = {
  apis: [
    {
      name: "window",
      description: "原生应用交互接口",
      properties: [
        {
          name: "activeUrl",
          type: "string",
          description: "当前活动页面的URL地址",
          example: "https://demo-app.mitrade.com/h5/activity/"
        }
      ],
      methods: [
        {
          name: "openH5Detail",
          description: "打开H5详情页面",
          params: [
            {
              name: "options",
              type: "object",
              description: "页面参数",
              required: true,
              children: [
                {
                  name: "url",
                  type: "string",
                  description: "页面URL地址",
                  required: true,
                  example: "https://demo-app.mitrade.com/h5/activity/welfare?needTitle=true"
                },
                {
                  name: "title",
                  type: "string",
                  description: "页面标题",
                  required: false
                }
              ]
            }
          ],
          returnType: "void",
          returnDescription: "无返回值",
          example: "window.openH5Detail({ url: location.origin + '/h5/activity/welfare?needTitle=true' });"
        },
        {
          name: "openNativePage",
          description: "打开APP原生页面",
          params: [
            {
              name: "options",
              type: "object",
              description: "页面参数",
              required: true,
              children: [
                {
                  name: "page",
                  type: "string",
                  description: "页面名称",
                  required: true
                },
                {
                  name: "symbol",
                  type: "string",
                  description: "品种代码",
                  required: false
                },
                {
                  name: "child",
                  type: "string",
                  description: "子页面名称",
                  required: false
                }
              ]
            }
          ],
          returnType: "void",
          returnDescription: "无返回值",
          example: `window.openNativePage({
                  page: "instrument_detail",
                  symbol: "NAS100"
                });`
        },
        {
          name: "getHeader",
          description: "获取当前APP页面的header信息",
          params: [
            {
              name: "callback",
              type: "function",
              description: "回调函数",
              required: true,
              children: [
                {
                  name: "headerInfo",
                  type: "object",
                  description: "header信息对象",
                  required: true
                }
              ]
            }
          ],
          returnType: "void",
          returnDescription: "无返回值",
          example: "window.getHeader((res) => { console.log(res); });"
        }
      ]
    }
  ]
};
