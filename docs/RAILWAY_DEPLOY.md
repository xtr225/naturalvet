# Natural Vet en Railway

## Backend Laravel

Crear un servicio desde la carpeta `backend`.

Variables mínimas:

```txt
APP_NAME=Natural Vet
APP_ENV=production
APP_DEBUG=false
APP_URL=https://TU_BACKEND_RAILWAY
FRONTEND_URL=https://TU_FRONTEND_RAILWAY
APP_KEY=base64:GENERAR_EN_RAILWAY
APP_LOCALE=es
APP_FALLBACK_LOCALE=es
APP_FAKER_LOCALE=es_PE
DB_CONNECTION=mysql
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file
NATURAL_VET_NOTIFICATION_PHONE=+51983739689
```

Railway puede entregar la base con estas variables automáticamente:

```txt
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=...
MYSQL_ROOT_PASSWORD=...
```

El backend ya es compatible con ese formato. Si usas esas variables de Railway, no necesitas duplicarlas como `DB_HOST`, `DB_DATABASE`, `DB_USERNAME` y `DB_PASSWORD`; solo asegúrate de tener:

```txt
DB_CONNECTION=mysql
```

Para backend dentro de Railway usa `MYSQLHOST=mysql.railway.internal`. El `MYSQL_PUBLIC_URL` sirve para conectarte desde tu computadora, no para el servicio Laravel dentro de Railway.

Comando de inicio:

```txt
php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

## Frontend React

Crear otro servicio desde la carpeta `frontend`.

Variable:

```txt
VITE_API_URL=https://TU_BACKEND_RAILWAY/api
```

Si aparece `Network Error` en el login, revisar primero estas dos variables:

```txt
Backend: FRONTEND_URL=https://TU_FRONTEND_RAILWAY
Frontend: VITE_API_URL=https://TU_BACKEND_RAILWAY/api
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
