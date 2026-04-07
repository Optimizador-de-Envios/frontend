# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_AUTH_API_BASE
ENV VITE_AUTH_API_BASE=$VITE_AUTH_API_BASE

ARG VITE_OPENROUTESERVICE_API_KEY
ENV VITE_OPENROUTESERVICE_API_KEY=$VITE_OPENROUTESERVICE_API_KEY

ARG VITE_ORDER_API_BASE
ENV VITE_ORDER_API_BASE=$VITE_ORDER_API_BASE

RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
