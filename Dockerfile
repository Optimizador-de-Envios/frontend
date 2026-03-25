# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Las variables VITE_ se incrustan en el bundle en tiempo de compilación,
# por eso se pasan como build args.
ARG VITE_OPENROUTESERVICE_API_KEY
ENV VITE_OPENROUTESERVICE_API_KEY=$VITE_OPENROUTESERVICE_API_KEY

RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
