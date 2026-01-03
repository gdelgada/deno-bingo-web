# ⚙️ Configuration Guide

Esta guía explica cómo configurar la aplicación Bingo Web usando variables de entorno.

## 📋 Tabla de Contenidos

- [Configuración Rápida](#configuración-rápida)
- [Variables Disponibles](#variables-disponibles)
- [Métodos de Configuración](#métodos-de-configuración)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Docker y Variables de Entorno](#docker-y-variables-de-entorno)

---

## 🚀 Configuración Rápida

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env`:**
   ```bash
   # Cambia el puerto a 3000
   SERVER_PORT=3000
   ```

3. **Ejecuta la aplicación:**
   ```bash
   deno task dev
   ```

¡Listo! El servidor se ejecutará en el puerto 3000.

---

## 📝 Variables Disponibles

### SERVER_PORT

**Descripción:** Puerto donde el servidor web escuchará las peticiones.

**Valores:**
- Cualquier número de puerto válido (1-65535)
- Puertos < 1024 requieren permisos de administrador

**Por defecto:** `8000`

**Ejemplos:**
```bash
SERVER_PORT=3000    # Puerto 3000
SERVER_PORT=8080    # Puerto 8080
SERVER_PORT=80      # Puerto HTTP estándar (requiere sudo/admin)
```

---

### DENO_ENV

**Descripción:** Define el entorno de ejecución de la aplicación.

**Valores:**
- `development` - Modo desarrollo
- `production` - Modo producción (recomendado para deploy)

**Por defecto:** `production`

**Ejemplos:**
```bash
DENO_ENV=development
DENO_ENV=production
```

---

### PUBLIC_DIR

**Descripción:** Ruta al directorio que contiene los archivos estáticos (HTML, CSS, JS).

**Valores:**
- Ruta absoluta o relativa al directorio público

**Por defecto:** `./public` (relativo a la raíz del proyecto)

**Ejemplos:**
```bash
PUBLIC_DIR=./public
PUBLIC_DIR=/var/www/bingo-web
```

> ⚠️ **Nota:** Solo modifica esta variable si has reorganizado la estructura del proyecto.

---

## 🔧 Métodos de Configuración

### Método 1: Archivo `.env` (Recomendado)

**Ventajas:**
- ✅ Fácil de mantener
- ✅ No necesitas recordar las variables cada vez
- ✅ Ideal para desarrollo local
- ✅ No se sube a Git (está en `.gitignore`)

**Pasos:**

1. Crea el archivo `.env` en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` con tus valores:
   ```bash
   SERVER_PORT=3000
   DENO_ENV=development
   ```

3. Ejecuta la aplicación:
   ```bash
   deno task dev
   ```

El archivo `.env` se cargará automáticamente.

---

### Método 2: Variables de Entorno del Sistema

**Ventajas:**
- ✅ Útil para scripts y CI/CD
- ✅ No requiere archivo adicional
- ✅ Puede sobrescribir valores del `.env`

**Linux/Mac:**
```bash
# Temporalmente (solo para este comando)
SERVER_PORT=3000 deno task dev

# Permanentemente en la sesión actual
export SERVER_PORT=3000
deno task dev

# Permanentemente para el usuario
echo "export SERVER_PORT=3000" >> ~/.bashrc
source ~/.bashrc
```

**Windows PowerShell:**
```powershell
# Temporalmente (solo para esta sesión)
$env:SERVER_PORT=3000
deno task dev

# O en una sola línea
$env:SERVER_PORT=3000; deno task dev
```

**Windows CMD:**
```cmd
# Temporalmente (solo para esta sesión)
set SERVER_PORT=3000
deno task dev

# O en una sola línea
set SERVER_PORT=3000 && deno task dev
```

---

### Método 3: Combinación de Ambos

Las variables de entorno del sistema **sobrescriben** las del archivo `.env`.

**Ejemplo:**

`.env` contiene:
```bash
SERVER_PORT=8000
```

Pero ejecutas:
```bash
SERVER_PORT=3000 deno task dev
```

**Resultado:** El servidor usará el puerto **3000** (variable del sistema tiene prioridad).

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Desarrollo Local en Puerto Personalizado

```bash
# .env
SERVER_PORT=3001
DENO_ENV=development
```

```bash
deno task dev
```

Accede en: `http://localhost:3001`

---

### Ejemplo 2: Multiple Instancias

Puedes ejecutar múltiples instancias del servidor en diferentes puertos:

**Terminal 1:**
```bash
SERVER_PORT=8000 deno task dev
```

**Terminal 2:**
```bash
SERVER_PORT=8001 deno task dev
```

**Terminal 3:**
```bash
SERVER_PORT=8002 deno task dev
```

---

### Ejemplo 3: Producción

```bash
# .env
SERVER_PORT=80
DENO_ENV=production
```

```bash
# Linux requiere sudo para puerto 80
sudo -E deno task dev
```

> **Nota:** El flag `-E` preserva las variables de entorno con sudo.

---

## 🐳 Docker y Variables de Entorno

### Con docker-compose (Recomendado)

Edita `compose.yaml`:

```yaml
services:
  bingo-dev:
    environment:
      - SERVER_PORT=3000
      - DENO_ENV=development
    ports:
      - "3000:3000"  # Host:Container
```

**Importante:** El puerto del contenedor y la variable `SERVER_PORT` deben coincidir.

---

### Con docker run

```bash
docker run -p 3000:3000 \
  -e SERVER_PORT=3000 \
  -e DENO_ENV=development \
  bingo:dev
```

---

### Usar .env con Docker

**Opción 1:** Archivo `.env` en docker-compose

```yaml
services:
  bingo-dev:
    env_file:
      - .env
    ports:
      - "${SERVER_PORT}:${SERVER_PORT}"
```

**Opción 2:** Pasar archivo al ejecutar

```bash
docker run --env-file .env -p 3000:3000 bingo:dev
```

---

## 🔍 Troubleshooting

### El .env no se carga

**Síntoma:** Los cambios en `.env` no tienen efecto.

**Soluciones:**
1. Verifica que el archivo se llama exactamente `.env` (no `.env.txt`)
2. Revisa que está en la raíz del proyecto
3. Reinicia el servidor (`Ctrl+C` y ejecuta de nuevo)
4. Verifica que no hay errores de sintaxis en `.env`

---

### Puerto ya en uso

**Síntoma:** `Error: Address already in use`

**Soluciones:**

**Linux/Mac:**
```bash
# Ver qué está usando el puerto 8000
lsof -i :8000

# Matar el proceso
kill -9 <PID>
```

**Windows:**
```powershell
# Ver qué está usando el puerto 8000
netstat -ano | findstr :8000

# Matar el proceso
taskkill /PID <PID> /F
```

O simplemente usa otro puerto en `.env`:
```bash
SERVER_PORT=8001
```

---

### Variables no funcionan en ejecutable compilado

**Síntoma:** El ejecutable compilado ignora las variables de entorno.

**Solución:** Pasa las variables al ejecutar el binario:

```bash
# Linux/Mac
SERVER_PORT=3000 ./output/bingo-web

# Windows
$env:SERVER_PORT=3000; .\output\bingo-web.exe
```

---

## 📚 Referencias

- [Deno Environment Variables](https://docs.deno.com/runtime/manual/basics/env_variables)
- [Deno Standard Library - dotenv](https://jsr.io/@std/dotenv)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)

---

**¿Preguntas?** Abre un issue en el repositorio.
