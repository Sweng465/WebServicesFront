FROM node:22.20.0 as builder

RUN mkdir -p /workspace/app && chown node:node /workspace -R

USER node:node

WORKDIR /workspace/app

# Pre cache packages
COPY --chown=node:node . /workspace/app

# Accept build-time API URL (Vite bakes env vars into the bundle at build time)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=${VITE_API_URL}

RUN npm install && npm run build

FROM node:22.20.0

RUN npm i -g serve

COPY --from=builder --chown=node:node /workspace/app/dist /app

USER node:node

WORKDIR /app

ENTRYPOINT ["serve", "-p", "3000",  "-s", "/app"]
