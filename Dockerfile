# ---- Stage 1: build frontend assets (Vite) ----
FROM node:20-alpine AS assets
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# ---- Stage 2: install PHP deps ----
FROM composer:2 AS vendor
WORKDIR /app
COPY web/composer.json web/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --ignore-platform-reqs
COPY web/ ./
RUN composer dump-autoload --optimize --no-dev

# ---- Stage 3: production runtime (php-fpm + nginx) ----
FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    nginx supervisor bash gettext \
    libpng-dev oniguruma-dev libxml2-dev libzip-dev sqlite \
    && docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd zip

WORKDIR /var/www

# App code + PHP deps from the vendor stage (already composer-installed)
COPY --from=vendor /app /var/www

# Built frontend assets from the assets stage
COPY --from=assets /app/public/build /var/www/public/build

RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache
# NOTE: no .env or artisan config/route caching here — Render does not expose
# Secret Files (or most env vars) during the Docker build step, only at
# container runtime. That work happens in entrypoint.sh instead.

COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
