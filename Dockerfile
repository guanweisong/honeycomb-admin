FROM node:16-slim AS Builder

# 创建app目录
RUN mkdir -p /usr/src/honeycomb-admin

# 设置工作目录
WORKDIR /usr/src/honeycomb-admin

COPY package.json yarn.lock /usr/src/honeycomb-admin/

RUN yarn

COPY . /usr/src/honeycomb-admin

RUN yarn run build

# 设置基础镜像
FROM nginx
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY --from=Builder /usr/src/honeycomb-admin/dist  /usr/share/nginx/html

# 覆盖nginx配置
COPY --from=Builder /usr/src/honeycomb-admin/nginx.conf	/etc/nginx/conf.d/default.conf
