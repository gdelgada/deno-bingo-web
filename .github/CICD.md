# CI/CD Configuration Guide

Este documento explica cómo está configurado el flujo CI/CD para construir y desplegar la aplicación Bingo Web.

## 🔄 Workflows

### 1. Deno Build (`deno-build.yml`)
Este workflow se encarga de validar y compilar el código:

- **Triggers**: Push a `main`/`develop`, Pull Requests, Manual
- **Acciones**:
  - ✅ Verifica el formato del código (`deno fmt`)
  - ✅ Ejecuta el linter (`deno lint`)
  - ✅ Ejecuta los tests unitarios
  - ✅ Compila la aplicación
  - 📦 Sube el binario compilado como artefacto

### 2. Docker Build & Deploy (`docker-deploy.yml`)
Este workflow construye y despliega la imagen Docker:

- **Triggers**: 
  - Push a `main`/`develop`
  - Después de que `Deno Build` se complete exitosamente en `main`
  - Manual
- **Acciones**:
  - 🐳 Construye la imagen Docker
  - 🏷️ Genera tags automáticos basados en la rama/commit
  - 📤 Sube la imagen al registry configurado
  - 🚀 Soporta multi-arquitectura (amd64, arm64)

## 🔧 Configuración de Registry

El workflow está preconfigurado para usar **GitHub Container Registry (ghcr.io)**, pero puedes cambiarlo fácilmente:

### Opción 1: GitHub Container Registry (Por defecto - Recomendado)

**Ventajas**: 
- ✅ Gratis para repositorios públicos
- ✅ Integración nativa con GitHub
- ✅ No requiere configuración adicional
- ✅ El `GITHUB_TOKEN` ya existe automáticamente

**Configuración**: Ya está lista, no necesitas hacer nada.

**URLs de las imágenes**:
```bash
ghcr.io/gdelgada/deno-bingo-web:latest
ghcr.io/gdelgada/deno-bingo-web:main
ghcr.io/gdelgada/deno-bingo-web:develop
ghcr.io/gdelgada/deno-bingo-web:main-abc123
```

**Para hacer la imagen pública**:
1. Ve a tu repositorio en GitHub
2. Packages → deno-bingo-web
3. Package settings → Change visibility → Public

### Opción 2: Docker Hub

**Pasos**:
1. Crea una cuenta en [Docker Hub](https://hub.docker.com)
2. Genera un Access Token:
   - Settings → Security → New Access Token
3. Agrega secrets en GitHub:
   - Settings → Secrets and variables → Actions → New repository secret
   - `DOCKER_USERNAME`: tu usuario de Docker Hub
   - `DOCKER_PASSWORD`: el Access Token generado
4. En `docker-deploy.yml`, comenta la sección de GitHub Container Registry y descomenta:

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

5. Actualiza el `images` en el step `meta`:
```yaml
images: |
  docker.io/${{ github.repository }}
```

### Opción 3: Registry Privado Personalizado

Si tienes tu propio registry privado (ej: Harbor, Azure Container Registry, AWS ECR):

1. Agrega secrets en GitHub:
   - `REGISTRY_USERNAME`
   - `REGISTRY_PASSWORD`
2. En `docker-deploy.yml`, descomenta y configura:

```yaml
- name: Log in to Private Registry
  uses: docker/login-action@v3
  with:
    registry: your-registry.example.com
    username: ${{ secrets.REGISTRY_USERNAME }}
    password: ${{ secrets.REGISTRY_PASSWORD }}
```

3. Actualiza el `images`:
```yaml
images: |
  your-registry.example.com/${{ github.repository }}
```

## 🏷️ Sistema de Tags

Las imágenes se etiquetan automáticamente:

| Evento | Tag generado | Ejemplo |
|--------|--------------|---------|
| Push a main | `latest` | `ghcr.io/user/repo:latest` |
| Push a branch | `<branch>` | `ghcr.io/user/repo:develop` |
| Commit específico | `<branch>-<sha>` | `ghcr.io/user/repo:main-abc123` |
| Pull Request | `pr-<number>` | `ghcr.io/user/repo:pr-42` |
| Tag de versión | `v1.2.3`, `v1.2`, `v1` | `ghcr.io/user/repo:v1.2.3` |

## 🚀 Desplegar la Imagen

### Usando Docker

```bash
# Pull de la imagen
docker pull ghcr.io/gdelgada/deno-bingo-web:latest

# Ejecutar el contenedor
docker run -p 8000:8000 ghcr.io/gdelgada/deno-bingo-web:latest
```

### Usando Docker Compose

El proyecto ya incluye un `docker-compose.yaml`. Solo necesitas actualizarlo si cambias de registry:

```yaml
version: '3.8'

services:
  bingo-web:
    image: ghcr.io/gdelgada/deno-bingo-web:latest
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Luego ejecuta:
```bash
docker-compose up -d
```

### Kubernetes

Ejemplo de deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bingo-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bingo-web
  template:
    metadata:
      labels:
        app: bingo-web
    spec:
      containers:
      - name: bingo-web
        image: ghcr.io/gdelgada/deno-bingo-web:latest
        ports:
        - containerPort: 8000
        env:
        - name: PORT
          value: "8000"
        livenessProbe:
          httpGet:
            path: /
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: bingo-web
spec:
  selector:
    app: bingo-web
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

## 🔐 Autenticación para Pull Privado

Si tu imagen es privada, necesitarás autenticarte para hacer pull:

### GitHub Container Registry

```bash
# Generar un Personal Access Token con scope 'read:packages'
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

# Pull de la imagen
docker pull ghcr.io/gdelgada/deno-bingo-web:latest
```

## 📊 Monitoreo de Workflows

Puedes ver el estado de tus workflows en:
- GitHub → Tu repositorio → Actions

Cada workflow mostrará:
- ✅ Estado (Success/Failure)
- 📝 Logs detallados de cada step
- 🏷️ Tags generados para las imágenes
- 📦 Artefactos generados

## 🛠️ Troubleshooting

### El workflow falla al subir la imagen

**Problema**: `denied: permission_denied`

**Solución**: Verifica que el workflow tenga permisos correctos. En el archivo YAML debe tener:
```yaml
permissions:
  contents: read
  packages: write
```

### La imagen es muy grande

**Solución**: El Dockerfile ya está optimizado con:
- Caching de capas de dependencias
- Solo copia archivos necesarios
- Usa imagen base oficial de Deno (Alpine-based)

### Quiero probar el workflow localmente

Puedes usar [act](https://github.com/nektos/act):

```bash
# Instalar act
choco install act-cli  # Windows

# Ejecutar el workflow localmente
act -j build-and-push
```

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build & Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Deno Docker Image](https://github.com/denoland/deno_docker)
