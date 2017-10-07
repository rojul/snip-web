FROM node:8-alpine as builder

WORKDIR /root/snip-web
COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM scratch

COPY --from=builder /root/snip-web/dist /dist
