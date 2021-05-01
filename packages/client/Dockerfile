FROM node:16 as builder

WORKDIR /build

COPY ["package.json", "yarn.lock", "/build/"]

RUN yarn

COPY ["src/", "/build/src/"]

RUN yarn build

FROM nginx:alpine

COPY --from=builder /build/dist/ /usr/share/nginx/html/
