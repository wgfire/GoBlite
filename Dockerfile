# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN corepack enable pnpm

# 步骤 1: 复制所有与包结构和依赖相关的核心文件
COPY package.json pnpm-workspace.yaml nx.json pnpm-lock.yaml* ./ 
# pnpm-lock.yaml* 确保如果它不存在也不会报错，但如果存在则复制

# 步骤 2: 复制所有项目文件 (包括所有工作区包的源代码)
COPY . . 
# 这会把 packages/, web-site/, builder/ 以及根目录的其他所有文件都复制过来

# 步骤 3: 安装所有工作区依赖
# 现在 pnpm install 可以访问所有工作区包的完整代码和 package.json
RUN pnpm install --frozen-lockfile --prefer-offline

# 后续的构建步骤（如构建 web-site）会在这里继续

# 构建参数，默认为 production
ARG BUILD_ENV=production

# 构建 web-site (Nx 会自动构建所有依赖)
RUN if [ "$BUILD_ENV" = "demo" ]; then \
      pnpm run build:web-site:demo; \
    else \
      pnpm run build:web-site; \
    fi

# 为 @go-blite/builder 包创建一个可部署的版本
# 这会在 /app/builder_deploy 目录下创建一个包含解除引用的 node_modules 的副本
RUN pnpm --filter @go-blite/builder deploy /app/builder_deploy --prod --legacy

# 为 operation-template 模板创建一个可部署的版本
RUN pnpm --filter operation-template deploy /app/vite_react_template_deploy --legacy --config.public-hoist-pattern[]='*'

# 为 web-site 包创建一个可部署的版本 (包含其生产依赖)
RUN pnpm --filter web-site deploy /app/web_site_deployed --prod --legacy --config.public-hoist-pattern[]='*'

# 生产环境阶段
FROM nginx:alpine AS production


RUN apk update && apk add --no-cache nodejs npm tini

WORKDIR /app


COPY --from=builder /app/web-site/dist /usr/share/nginx/html


COPY --from=builder /app/builder_deploy ./builder

# 复制 web-site 源代码，builder 服务会引用它
# viteBuilder.js 将使用 WEB_SITE_SELECTORS_ABSOLUTE_PATH 来查找 /app/web-site/src/selectors
# 复制完整的 web-site 包 (包含其 node_modules)
COPY --from=builder /app/web_site_deployed /app/web-site

# 为 builder 服务设置环境变量，以定位 web-site selectors
ENV WEB_SITE_SELECTORS_ABSOLUTE_PATH=/app/web-site/src/selectors

# 然后用专门部署的、包含 node_modules 的 operation-template 覆盖相应路径
COPY --from=builder /app/vite_react_template_deploy /app/builder/templates/operation-template

COPY --from=builder /app/builder/.env ./builder/.env

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
ENTRYPOINT ["/sbin/tini", "--"]

# Set the command to run the start script
CMD ["/start.sh"]
