import { CustomApiType } from "../types";

/**
 * Web API 提示
 */
export const webApis: CustomApiType = {
  apis: [
    {
      name: "window",
      description: "浏览器窗口对象",
      methods: [
        {
          name: "fetch",
          description: "发起网络请求，返回 Promise",
          params: [
            {
              name: "url",
              type: "string",
              description: "请求的URL地址",
              required: true,
              example: "https://api.example.com/data"
            },
            {
              name: "options",
              type: "object",
              description: "请求配置选项",
              required: false,
              children: [
                {
                  name: "method",
                  type: "string",
                  description: "HTTP请求方法",
                  required: false,
                  example: "GET"
                },
                {
                  name: "headers",
                  type: "object",
                  description: "HTTP请求头",
                  required: false,
                  example: "{ 'Content-Type': 'application/json' }"
                },
                {
                  name: "body",
                  type: "string | FormData | URLSearchParams",
                  description: "请求体数据",
                  required: false,
                  example: "JSON.stringify({ name: 'value' })"
                },
                {
                  name: "mode",
                  type: "string",
                  description: "请求模式",
                  required: false,
                  example: "cors"
                },
                {
                  name: "credentials",
                  type: "string",
                  description: "凭据模式",
                  required: false,
                  example: "include"
                }
              ]
            }
          ],
          returnType: "Promise<Response>",
          returnDescription: "返回包含响应的Promise对象",
          example: `fetch("https://api.example.com/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ key: "value" })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));`
        }
      ],
      properties: [
        {
          name: "location",
          type: "Location",
          description: "当前页面的URL信息",
          example: "window.location.href"
        },
        {
          name: "localStorage",
          type: "Storage",
          description: "本地存储对象",
          example: "window.localStorage.getItem('key')"
        },
        {
          name: "sessionStorage",
          type: "Storage",
          description: "会话存储对象",
          example: "window.sessionStorage.setItem('key', 'value')"
        },
        {
          name: "navigator",
          type: "Navigator",
          description: "浏览器信息对象",
          example: "window.navigator.userAgent"
        }
      ]
    },
    {
      name: "location",
      description: "当前页面的URL信息",
      properties: [
        {
          name: "href",
          type: "string",
          description: "完整的URL",
          example: "https://www.example.com/path?query=value#hash"
        },
        {
          name: "origin",
          type: "string",
          description: "URL的协议、主机名和端口",
          example: "https://www.example.com"
        },
        {
          name: "protocol",
          type: "string",
          description: "URL的协议部分",
          example: "https:"
        },
        {
          name: "host",
          type: "string",
          description: "URL的主机名和端口",
          example: "www.example.com:443"
        },
        {
          name: "hostname",
          type: "string",
          description: "URL的主机名",
          example: "www.example.com"
        },
        {
          name: "port",
          type: "string",
          description: "URL的端口号",
          example: "443"
        },
        {
          name: "pathname",
          type: "string",
          description: "URL的路径部分",
          example: "/path/to/page"
        },
        {
          name: "search",
          type: "string",
          description: "URL的查询字符串部分",
          example: "?query=value&name=test"
        },
        {
          name: "hash",
          type: "string",
          description: "URL的片段标识符部分",
          example: "#section1"
        }
      ],
      methods: [
        {
          name: "reload",
          description: "重新加载当前页面",
          params: [
            {
              name: "forceReload",
              type: "boolean",
              description: "是否强制从服务器重新加载",
              required: false,
              example: "true"
            }
          ],
          returnType: "void",
          returnDescription: "无返回值",
          example: "location.reload(true);"
        },
        {
          name: "replace",
          description: "用新的URL替换当前页面（不会在历史记录中创建新条目）",
          params: [
            {
              name: "url",
              type: "string",
              description: "新的URL",
              required: true,
              example: "https://www.example.com/newpage"
            }
          ],
          returnType: "void",
          returnDescription: "无返回值",
          example: "location.replace('https://www.example.com/newpage');"
        },
        {
          name: "assign",
          description: "加载新的文档（会在历史记录中创建新条目）",
          params: [
            {
              name: "url",
              type: "string",
              description: "新的URL",
              required: true,
              example: "https://www.example.com/newpage"
            }
          ],
          returnType: "void",
          returnDescription: "无返回值",
          example: "location.assign('https://www.example.com/newpage');"
        }
      ]
    }
  ]
};
