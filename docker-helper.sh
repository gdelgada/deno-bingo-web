#!/bin/bash

# Bingo Web - Docker & Deploy Helper Scripts

# Para desarrollo local
echo -e "\033[0;36m🚀 Bingo Web - Docker Helper\033[0m"
echo ""

function show_menu {
    echo -e "\033[0;33mSelecciona una opción:\033[0m"
    echo -e "\033[0;32m1. 🏗️  Build local (Docker)\033[0m"
    echo -e "\033[0;32m2. ▶️  Ejecutar en desarrollo\033[0m"
    echo -e "\033[0;34m3. 🌐 Ejecutar desde registry (producción)\033[0m"
    echo -e "\033[0;31m4. 🛑 Detener contenedores\033[0m"
    echo -e "\033[0;36m5. 📊 Ver logs\033[0m"
    echo -e "\033[0;35m6. 🧹 Limpiar todo\033[0m"
    echo -e "\033[0;37m7. ❌ Salir\033[0m"
    echo ""
}

function build_local {
    echo -e "\033[0;32m🏗️  Construyendo imagen local...\033[0m"
    docker build -t bingo:dev .
    if [ $? -eq 0 ]; then
        echo -e "\033[0;32m✅ Build completado!\033[0m"
    else
        echo -e "\033[0;31m❌ Error en el build\033[0m"
    fi
}

function run_dev {
    echo -e "\033[0;32m▶️  Iniciando en modo desarrollo...\033[0m"
    docker-compose --profile dev up -d
    if [ $? -eq 0 ]; then
        echo -e "\033[0;32m✅ Aplicación corriendo en http://localhost:8000\033[0m"
        echo -e "\033[0;36m💡 Usa 'docker-compose --profile dev logs -f' para ver los logs\033[0m"
    fi
}

function run_prod {
    echo -e "\033[0;34m🌐 Iniciando desde registry (producción)...\033[0m"
    echo -e "\033[0;36m📥 Descargando imagen del registry...\033[0m"
    docker-compose --profile prod pull
    docker-compose --profile prod up -d
    if [ $? -eq 0 ]; then
        echo -e "\033[0;32m✅ Aplicación corriendo en http://localhost:8000\033[0m"
        echo -e "\033[0;36m💡 Usa 'docker-compose --profile prod logs -f' para ver los logs\033[0m"
    fi
}

function stop_containers {
    echo -e "\033[0;31m🛑 Deteniendo contenedores...\033[0m"
    docker-compose --profile dev down
    docker-compose --profile prod down
    echo -e "\033[0;32m✅ Contenedores detenidos\033[0m"
}

function show_logs {
    echo -e "\033[0;36m📊 Mostrando logs...\033[0m"
    echo -e "\033[0;33mPresiona Ctrl+C para salir\033[0m"
    echo ""
    running=$(docker ps --format "{{.Names}}" | grep "bingo-app")
    if [ -n "$running" ]; then
        docker logs -f $running
    else
        echo -e "\033[0;33m⚠️  No hay contenedores corriendo\033[0m"
    fi
}

function clean_all {
    echo -e "\033[0;35m🧹 Limpiando todo...\033[0m"
    docker-compose --profile dev down -v
    docker-compose --profile prod down -v
    echo -e "\033[0;33m🗑️  ¿Quieres eliminar también las imágenes? (S/N)\033[0m"
    read -r response
    if [[ "$response" =~ ^[Ss]$ ]]; then
        docker rmi bingo:dev -f 2>/dev/null
        docker rmi ghcr.io/gdelgada/deno-bingo-web:latest -f 2>/dev/null
        echo -e "\033[0;32m✅ Imágenes eliminadas\033[0m"
    fi
    echo -e "\033[0;32m✅ Limpieza completada\033[0m"
}

# Main loop
while true; do
    show_menu
    read -p "Opción: " option
    echo ""
    
    case $option in
        1)
            build_local
            ;;
        2)
            run_dev
            ;;
        3)
            run_prod
            ;;
        4)
            stop_containers
            ;;
        5)
            show_logs
            ;;
        6)
            clean_all
            ;;
        7)
            echo -e "\033[0;36m👋 ¡Hasta luego!\033[0m"
            break
            ;;
        *)
            echo -e "\033[0;31m⚠️  Opción inválida\033[0m"
            ;;
    esac
    
    echo ""
    echo -e "\033[0;37mPresiona Enter para continuar...\033[0m"
    read
    clear
done
