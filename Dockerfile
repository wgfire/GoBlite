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

# 生产环境阶段
FROM nginx:alpine AS production

# 从构建阶段复制构建产物
COPY --from=builder /app/web-site/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
