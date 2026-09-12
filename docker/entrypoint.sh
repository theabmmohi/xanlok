#!/bin/sh
set -e

APP_DIR=/var/www
SECRET_ENV=/etc/secrets/.env

# Render Docker services expose Secret Files at /etc/secrets/<filename> at
# runtime only (never at build time). Copy it into the Laravel app root.
if [ -f "$SECRET_ENV" ]; then
    cp "$SECRET_ENV" "$APP_DIR/.env"
    echo "Loaded .env from Render secret file."
else
    echo "WARNING: $SECRET_ENV not found, app may fail without APP_KEY etc."
fi

cd "$APP_DIR"

# Generate APP_KEY only if missing (won't overwrite one already in .env)
php artisan key:generate --force --no-interaction || true

# No external DB: make sure the sqlite file exists (harmless if unused)
mkdir -p database
[ -f database/database.sqlite ] || touch database/database.sqlite

# Migrate to database
php artisan migrate --force

# Cache config/routes/views now that .env is finally present
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Laravel needs the storage symlink for public file access
php artisan storage:link || true

chown -R www-data:www-data storage bootstrap/cache database

# Render assigns the port dynamically via $PORT (default 10000 if unset).
# nginx.conf.template has a "listen ${PORT};" placeholder — render it here.
export PORT="${PORT:-10000}"
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"
