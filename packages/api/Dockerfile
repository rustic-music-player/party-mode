FROM node:16 as builder

WORKDIR /build

COPY ["package.json", "yarn.lock", "/build/"]

RUN yarn

COPY ["nest-cli.json", "tsconfig.json", "tsconfig.build.json", "/build/"]
COPY ["src/", "/build/src/"]

RUN yarn build

FROM node:16-slim

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "/app/"]

RUN yarn

COPY --from=builder /build/dist/ /app/dist/

EXPOSE 3000

ENTRYPOINT node /app/dist/main.js
