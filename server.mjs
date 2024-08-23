import { createServer } from "http";
import { parse } from "url";
import next from "next";

function test() {
  const dev = process.env.NODE_ENV !== "production";
  const port = parseInt(process.env.PORT, 10) || 3000;

  const app = next({ dev });
  const handle = app.getRequestHandler();

  const projectMap = {
    "/pagea": "project/pagea",
    // 你可以根据需要添加更多的项目
  };

  const projectAppMap = {};

  app.prepare().then(() => {
    createServer((req, res) => {
      console.log(`> 启动 ${req.url} `, req.headers.referer);
      const parsedUrl = parse(req.headers.referer ?? req.url, true);
      const { pathname } = parsedUrl;

      // 检查路径是否匹配某个子项目
      for (const prefix in projectMap) {
        if (pathname.startsWith(prefix)) {
          if (!projectAppMap[prefix]) {
            const projectDir = projectMap[prefix];
            console.log(`> next创建应用 in ${projectDir}`);
            projectAppMap[prefix] = next({ dev, dir: projectDir });
            projectAppMap[prefix].prepare().then(() => {
              console.log("next应用准备完成", pathname);
              projectAppMap[prefix].render(req, res, parsedUrl.pathname, parsedUrl.query);
              // projectAppMap[prefix].getRequestHandler()(req, res, parsedUrl);
            });
          } else {
            console.log(`> 处理请求 in ${prefix} ${pathname}`);
            projectAppMap[prefix].getRequestHandler()(req, res, parsedUrl);
          }
          return;
        }
      }

      console.log(`> 主应用处理请求 ${pathname}`);

      // 如果路径不匹配任何子项目，则处理为主应用的请求
      handle(req, res);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
    });
  });
}

function test1() {
  const dev = process.env.NODE_ENV !== "production";
  const port = parseInt(process.env.PORT, 10) || 3000;

  const app = next({ dev });
  const handle = app.getRequestHandler();



  const projectMap = {
    "/": { init: { dev } },
    "/pagea": { init: { dev, dir: "project/pagea" } },
  };

  const prepareProjects = async () => {
    for (const projectApp of Object.values(projectMap)) {
      const { init } = projectApp;
      if (init) {
        console.log(`> next创建应用 in ${init}`);
        projectApp.app = next(init);
        projectApp.handle = projectApp.app.getRequestHandler();
        await projectApp.app.prepare();
        console.log(`> ${init.dir}应用准备完成`);
      }
    }
    console.log("next应用全部准备完成");
  };

  prepareProjects().then(() => {
    console.log("server开始监听");
    createServer((req, res) => {
      const prefix = parse(req.headers.referer ?? req.url, true).pathname;
      const parsedUrl = parse(req.url, true);
      const app = projectMap[prefix];
      console.log(`> 启动 ${req.url} `, req.headers.referer);
        if (app) {
          console.log(`> 处理请求 in ${prefix}`, req.url);
          app.handle(req, res, parsedUrl);
          return;
        } else {
          console.log(`> 请求未匹配    ${prefix}`);
        }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
    });
  });
}

test1();
//test();
