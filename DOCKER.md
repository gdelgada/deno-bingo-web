# 🐳 Docker Deployment Guide

Esta guía te explica cómo usar Docker para ejecutar la aplicación Bingo Web.

## 🚀 Quick Start

### Opción 1: Desarrollo Local (Build Local)

```bash
# O manualmente:
docker-compose --profile dev up -d
```

### Opción 2: Producción (Desde Registry)

```bash
# O manualmente:
docker-compose --profile prod up -d
```

### Opción 3: Docker directo

```bash
# Build
docker build -t bingo:local .

# Run
docker run -p 8000:8000 bingo:local
```

## 📋 Comandos Comunes

### Desarrollo Local

```bash
# Build de la imagen
docker build -t bingo:dev .

# Ejecutar con docker-compose
docker-compose --profile dev up -d

# Ver logs
docker-compose --profile dev logs -f

# Detener
docker-compose --profile dev down

# Rebuild y restart
docker-compose --profile dev up -d --build
```

### Producción (Registry)

```bash
# Pull de la última imagen
docker pull ghcr.io/gdelgada/deno-bingo-web:latest

# Ejecutar con docker-compose
docker-compose --profile prod up -d

# Ver logs
docker-compose --profile prod logs -f

# Detener
docker-compose --profile prod down

# Actualizar a la última versión
docker-compose --profile prod pull
docker-compose --profile prod up -d
```

## 🔧 Variables de Entorno

Puedes configurar las siguientes variables de entorno:

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `PORT` | Puerto donde escucha el servidor | `8000` |
| `DENO_ENV` | Entorno de ejecución | `production` |

Ejemplo:

```bash
# Cambiar puerto
docker run -p 3000:3000 -e PORT=3000 bingo:dev

# Con docker-compose, edita docker-compose.yaml:
environment:
  - PORT=3000
```

## 🏥 Health Checks

La imagen incluye health checks automáticos:

```bash
# Ver el estado de salud
docker ps

# Detalles del health check
docker inspect bingo-app-prod | grep Health
```

El health check verifica cada 30 segundos que la aplicación responde en `http://localhost:8000`.

## 📦 Perfiles de Docker Compose

El `docker-compose.yaml` incluye dos perfiles:

### Profile: `dev` 
- **Imagen**: Build local desde Dockerfile
- **Nombre**: `bingo-app-dev`
- **Uso**: Desarrollo y testing local

### Profile: `prod`
- **Imagen**: Pull desde `ghcr.io/gdelgada/deno-bingo-web:latest`
- **Nombre**: `bingo-app-prod`  
- **Uso**: Producción y despliegue

## 🔍 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker logs bingo-app-dev

# O con docker-compose
docker-compose --profile dev logs
```

### Puerto ya en uso

```bash
# Cambiar el puerto del host
# En docker-compose.yaml, cambia:
ports:
  - "3000:8000"  # Host:Container
```

### Problemas con la imagen del registry

```bash
# Verificar que estás autenticado
docker login ghcr.io

# Force pull
docker pull ghcr.io/gdelgada/deno-bingo-web:latest --no-cache
```

### La aplicación no responde

```bash
# Verificar que el contenedor está corriendo
docker ps

# Verificar el health check
docker inspect bingo-app-prod

# Probar acceso
curl http://localhost:8000
```

## 🧹 Limpieza

### Limpiar contenedores

```bash
# Detener y eliminar
docker-compose --profile dev down
docker-compose --profile prod down

# Con volúmenes
docker-compose --profile dev down -v
```

### Limpiar imágenes

```bash
# Eliminar imagen local
docker rmi bingo:dev

# Eliminar imagen del registry
docker rmi ghcr.io/gdelgada/deno-bingo-web:latest

# Limpiar todo (imágenes no usadas)
docker image prune -a
```

### Limpieza completa

```bash
# Manualmente:
docker-compose --profile dev down -v
docker-compose --profile prod down -v
docker system prune -a
```

## 🌐 Despliegue en Servidor

### Con Docker

```powershell
# En el servidor, pull de la imagen
docker pull ghcr.io/gdelgada/deno-bingo-web:latest

# Ejecutar
docker run -d \
  --name bingo-web \
  -p 80:8000 \
  --restart unless-stopped \
  ghcr.io/gdelgada/deno-bingo-web:latest
```

### Con Docker Compose

```bash
# Copiar docker-compose.yaml al servidor
# Ejecutar
docker-compose --profile prod up -d
```

### Con Nginx como Reverse Proxy

```nginx
server {
    listen 80;
    server_name bingo.example.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring

### Ver recursos usados

```bash
# Stats en tiempo real
docker stats bingo-app-prod

# Uso de disco
docker system df
```

### Logs

```bash
# Últimos 100 logs
docker logs --tail 100 bingo-app-prod

# Logs en tiempo real
docker logs -f bingo-app-prod

# Logs con timestamps
docker logs -t bingo-app-prod
```

## 🔐 Registry Privado

Si estás usando un registry privado, debes autenticarte primero:

### GitHub Container Registry

```bash
# Crear un Personal Access Token con scope 'read:packages'
# Luego autenticarse:
export CR_PAT="tu_token_aqui"
echo $CR_PAT | docker login ghcr.io -u tu_usuario --password-stdin
```

### Docker Hub

```bash
docker login
# Ingresa usuario y password
```

### Registry Personalizado

```bash
docker login your-registry.example.com
```

## 📚 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Deno Docker Image](https://github.com/denoland/deno_docker)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## 🆘 Ayuda

Si tienes problemas:

1. Revisa los logs: `docker logs bingo-app-prod`
2. Verifica el health check: `docker inspect bingo-app-prod`
3. Prueba la conexión: `curl http://localhost:8000`
4. Revisa la documentación de CI/CD: `.github/CICD.md`
