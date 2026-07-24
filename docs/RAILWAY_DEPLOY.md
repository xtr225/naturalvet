# Natural Vet en Railway

## Backend Laravel

Crear un servicio desde la carpeta `backend`.

Variables mínimas:

```txt
APP_NAME=Natural Vet
APP_ENV=production
APP_DEBUG=false
APP_URL=https://TU_BACKEND_RAILWAY
APP_KEY=base64:GENERAR_EN_RAILWAY
APP_LOCALE=es
APP_FALLBACK_LOCALE=es
APP_FAKER_LOCALE=es_PE
DB_CONNECTION=mysql
DB_HOST=HOST_MYSQL_RAILWAY
DB_PORT=3306
DB_DATABASE=DATABASE_MYSQL_RAILWAY
DB_USERNAME=USER_MYSQL_RAILWAY
DB_PASSWORD=PASSWORD_MYSQL_RAILWAY
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file
NATURAL_VET_NOTIFICATION_PHONE=+51983739689
```

Comando de inicio:

```txt
php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

## Frontend React

Crear otro servicio desde la carpeta `frontend`.

Variable:

```txt
VITE_API_URL=https://TU_BACKEND_RAILWAY/api
```

Build:

```txt
npm install && npm run build
```

Salida publicada:

```txt
dist
```

## Credenciales iniciales

```txt
admin@vetsystem.test
admin123
```
