#!/bin/bash

while getopts p:d: flag; do
  case "${flag}" in
  p) PREFIX=${OPTARG} ;;
  d) PATH_NAME=${OPTARG} ;;
  *)
    echo "Invalid option ${flag}"
    exit 1
    ;;
  esac
done
shift $((OPTIND - 1))
PLUGIN_PATH=$1

# Verifica si la carpeta es un directorio
if [ -d "$PLUGIN_PATH" ]; then
  # Cambia al directorio
  cd "$PLUGIN_PATH" || exit

  # Extrae el nombre del directorio actual para usarlo como nombre de la imagen
  plugin_name=$(echo "$PLUGIN_PATH" | awk -F'/' '{print $(NF-1)}' | sed 's/^leemons-plugin-//')
  image_and_ecr_name=$plugin_name

  if [ -n "$PREFIX" ]; then
    image_and_ecr_name=$(echo "$PREFIX-$image_and_ecr_name")
  fi

  if [ -f package.json ]; then
    jq 'del(.version)' package.json >temp.json && mv temp.json package.json
  fi

  # Comprobamos si existe archivo Dockerfile
  if [ -e Dockerfile ]; then
    # Construye la imagen de Docker
    docker build -t "$image_and_ecr_name" .
    # Vuelve al directorio original
    cd - || exit
  else
    # Vuelve al directorio original
    cd - || exit
    # Construye la imagen de Docker usando el Dockerfile generico
    if [ -d "$PATH_NAME" ]; then
      docker build --platform=linux/amd64 --build-arg PLUGIN_NAME="$plugin_name" --build-arg PATH_NAME="$PATH_NAME" -t "$image_and_ecr_name" .
    else
      docker build --platform=linux/amd64 --build-arg PLUGIN_NAME="$plugin_name" -t "$image_and_ecr_name" .
    fi
  fi

else
  echo "La carpeta '$PLUGIN_PATH' no es un directorio válido."
fi
