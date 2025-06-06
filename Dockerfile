# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN corepack enable pnpm

# 复制 package.json 和 pnpm-lock.yaml（如果存在）
COPY package.json pnpm-workspace.yaml nx.json pnpm-lock.yaml ./
COPY packages/design/package.json ./packages/design/
COPY packages/shadcn/package.json ./packages/shadcn/
COPY packages/events/package.json ./packages/events/
COPY web-site/package.json ./web-site/
COPY builder/package.json ./builder/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制所有源代码
COPY . .

# 构建参数，默认为 production
ARG BUILD_ENV=production

# 构建 web-site (Nx 会自动构建所有依赖)
RUN if [ "$BUILD_ENV" = "demo" ]; then \
      pnpm run build:web-site -- --mode demo; \
    elif [ "$BUILD_ENV" = "stage" ]; then \
      pnpm run build:web-site -- --mode stage; \
    else \
      pnpm run build:web-site; \
    fi

# 为 @go-blite/builder 包创建一个可部署的版本
# 这会在 /app/builder_deploy 目录下创建一个包含解除引用的 node_modules 的副本
RUN pnpm --filter @go-blite/builder deploy /app/builder_deploy --prod --legacy

# 生产环境阶段
FROM nginx:alpine AS production


RUN apk update && apk add --no-cache nodejs npm tini

WORKDIR /app


COPY --from=builder /app/web-site/dist /usr/share/nginx/html


COPY --from=builder /app/builder_deploy ./builder

COPY --from=builder /app/builder/.env ./builder/.env

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
ENTRYPOINT ["/sbin/tini", "--"]

# Set the command to run the start script
CMD ["/start.sh"]
