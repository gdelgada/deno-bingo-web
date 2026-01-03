# 🐳 Container Helper Scripts

Esta guía explica cómo usar los scripts helper para gestionar contenedores de la aplicación Bingo Web con **Docker**.

## 📋 Scripts Disponibles

Tenemos un **script helper** para gestionar Docker en sistemas Unix:

| Script | Plataforma | Herramienta | Uso Principal |
|--------|-----------|-------------|---------------|
| `docker-helper.sh` | Linux/Mac | Docker | Bash en sistemas Unix |

---



## 🐧 Linux/Mac - Bash (Docker)

### Requisitos Previos
- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Bash shell

### Cómo Ejecutar

1. **Dale permisos de ejecución** (solo la primera vez):
   ```bash
   chmod +x docker-helper.sh
   ```

2. **Ejecuta el script**:
   ```bash
   ./docker-helper.sh
   ```



---

## 🎯 Opciones del Menú

Todos los scripts ofrecen el mismo menú interactivo con 7 opciones:

### 1. 🏗️ Build local

**¿Qué hace?**
- Construye una imagen de contenedor local desde el `Dockerfile`
- Etiqueta la imagen como `bingo:dev`
- Útil para desarrollo y pruebas locales

**Cuándo usarlo:**
- Cuando modificas el código y quieres probarlo en un contenedor
- Para desarrollo local sin necesidad de descargar desde un registry

**Comando equivalente:**
```bash
docker build -t bingo:dev .
```

---

### 2. ▶️ Ejecutar en desarrollo

**¿Qué hace?**
- Inicia la aplicación usando la imagen local `bingo:dev`
- Usa el perfil `dev` del `docker-compose.yml`
- Ejecuta en modo background (detached)

**Cuándo usarlo:**
- Después de hacer build local
- Para desarrollo y pruebas en tu máquina

**La aplicación estará disponible en:** `http://localhost:8000`

**Comando equivalente:**
```bash
docker-compose --profile dev up -d
```

---

### 3. 🌐 Ejecutar desde registry (producción)

**¿Qué hace?**
- Descarga la última imagen desde el registry (GitHub Container Registry)
- Inicia la aplicación con la imagen oficial
- Usa el perfil `prod` del `docker-compose.yml`

**Cuándo usarlo:**
- Cuando quieres usar la versión oficial/publicada
- Para despliegues en producción o staging
- Cuando NO necesitas hacer cambios en el código

**La aplicación estará disponible en:** `http://localhost:8000`

**Comando equivalente:**
```bash
docker-compose --profile prod pull
docker-compose --profile prod up -d
```

---

### 4. 🛑 Detener contenedores

**¿Qué hace?**
- Detiene todos los contenedores en ejecución (dev y prod)
- Elimina los contenedores parados
- NO elimina las imágenes ni volúmenes

**Cuándo usarlo:**
- Cuando terminas de trabajar y quieres liberar recursos
- Antes de cambiar entre modo dev y prod

**Comando equivalente:**
```bash
docker-compose --profile dev down
docker-compose --profile prod down
```

---

### 5. 📊 Ver logs

**¿Qué hace?**
- Muestra los logs en tiempo real del contenedor en ejecución
- Busca contenedores con el nombre que incluya `bingo-app`
- Modo follow (seguimiento continuo)

**Cuándo usarlo:**
- Para debugging y diagnóstico de problemas
- Para ver qué está pasando dentro del contenedor
- Para verificar que la aplicación está corriendo correctamente

**Salir de los logs:** Presiona `Ctrl+C`

**Comando equivalente:**
```bash
docker logs -f <nombre-del-contenedor>
```

---

### 6. 🧹 Limpiar todo

**¿Qué hace?**
1. Detiene todos los contenedores (dev y prod)
2. Elimina contenedores y volúmenes asociados
3. **Pregunta** si también quieres eliminar las imágenes

**Cuándo usarlo:**
- Cuando quieres empezar desde cero
- Para liberar espacio en disco
- Al finalizar completamente el desarrollo

**⚠️ Advertencia:** Los volúmenes se eliminarán, lo que significa que se perderán datos persistentes.

**Comando equivalente:**
```bash
docker-compose --profile dev down -v
docker-compose --profile prod down -v
docker rmi bingo:dev -f
docker rmi ghcr.io/gdelgada/deno-bingo-web:latest -f
```

---

### 7. ❌ Salir

Sale del script helper.

---

## 📝 Ejemplos de Uso Común

### Flujo de Desarrollo Local

```bash
# 1. Construir imagen local
# Selecciona: 1

# 2. Ejecutar en desarrollo
# Selecciona: 2

# 3. Ver logs para verificar
# Selecciona: 5
# (Ctrl+C para salir)

# 4. Hacer cambios en el código...

# 5. Detener contenedores
# Selecciona: 4

# 6. Rebuild con cambios
# Selecciona: 1

# 7. Volver a ejecutar
# Selecciona: 2
```

### Ejecutar Versión de Producción

```bash
# 1. Ejecutar desde registry
# Selecciona: 3

# Listo! La app está corriendo en http://localhost:8000
```

### Limpieza Completa

```bash
# 1. Limpiar todo
# Selecciona: 6

# 2. Cuando pregunte por las imágenes, responder: S
```

---

## 🔍 Troubleshooting

### El script no se ejecuta (Linux/Mac)

**Problema:** `Permission denied`

**Solución:**
```bash
chmod +x docker-helper.sh
```

### Puerto 8000 ya en uso

**Problema:** `Error: port is already allocated`

**Solución:**
1. Detén otros servicios en el puerto 8000
2. O modifica el `docker-compose.yml` para usar otro puerto



### No se puede conectar al daemon de Docker

**Problema:** `Cannot connect to the Docker daemon`

**Solución:**
1. Asegúrate de que Docker Desktop está corriendo (Windows/Mac)
2. O inicia el servicio de Docker (Linux):
   ```bash
   sudo systemctl start docker
   ```

### Imagen no se encuentra en el registry

**Problema:** `Error response from daemon: manifest for ghcr.io/... not found`

**Solución:**
1. Verifica que la imagen existe en el registry
2. O usa el modo desarrollo (opción 1 + 2) para build local

---

## 🎨 Colores en la Terminal

Los scripts usan códigos ANSI para colores:
- 🟢 **Verde**: Operaciones exitosas, desarrollo
- 🔵 **Azul**: Producción
- 🔴 **Rojo**: Acciones destructivas, errores
- 🟡 **Amarillo**: Advertencias, preguntas
- 🔵 **Cyan**: Información, sugerencias
- 🟣 **Magenta**: Limpieza

---

## 🔗 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Profiles](https://docs.docker.com/compose/profiles/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

## 🤝 Contribuciones

Si encuentras problemas o tienes sugerencias para mejorar estos scripts, por favor abre un issue o pull request en el repositorio.

---

**Made with ❤️ for easy container management**
