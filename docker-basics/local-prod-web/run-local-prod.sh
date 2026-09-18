#!/bin/sh

set -eu

usage() {
  echo "Použití: $0 [project-dir] [env-file]"
  echo ""
  echo "project-dir: kořen projektu, výchozí je aktuální adresář"
  echo "env-file: název nebo cesta k env souboru, výchozí je .env.PUBLIC_WEB_PROD"
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

PROJECT_DIR=${1:-.}
ENV_FILE_NAME=${2:-.env.PUBLIC_WEB_PROD}

PROJECT_DIR=$(CDPATH= cd -- "$PROJECT_DIR" && pwd)
cd "$PROJECT_DIR"

if [ -f "$ENV_FILE_NAME" ]; then
  ENV_FILE=$ENV_FILE_NAME
elif [ -f "envs/$ENV_FILE_NAME" ]; then
  ENV_FILE="envs/$ENV_FILE_NAME"
else
  echo "Env soubor neexistuje: $ENV_FILE_NAME"
  echo "Hledáno v projektu $PROJECT_DIR a v $PROJECT_DIR/envs/"
  exit 1
fi

BACKUP_ENV=".env.before-local-prod"

if [ -e "$BACKUP_ENV" ]; then
  echo "Existuje záloha $BACKUP_ENV. Nejdřív ji zkontroluj."
  exit 1
fi

HAD_ENV=0

if [ -e .env ]; then
  mv .env "$BACKUP_ENV"
  HAD_ENV=1
fi

restore_env() {
  rm -f .env

  if [ "$HAD_ENV" -eq 1 ]; then
    mv "$BACKUP_ENV" .env
  fi
}

trap restore_env EXIT

cp "$ENV_FILE" .env

corepack enable
pnpm install --frozen-lockfile
USE_REDIS_CACHE=false NEXT_PUBLIC_WEB_URL=http://localhost:3000 pnpm build

mkdir -p .next/standalone/.next/static
mkdir -p .next/standalone/public

cp -R .next/static/. .next/standalone/.next/static/
cp -R public/. .next/standalone/public/

USE_REDIS_CACHE=false NEXT_PUBLIC_WEB_URL=http://localhost:3000 node --env-file=.env .next/standalone/server.js
