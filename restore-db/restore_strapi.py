#!/usr/bin/env python3

import subprocess
import sys

# ====== KONFIGURACE ======
CONTAINER = "postgres_strapi"
DB = "postgres_strapi"
USER = "postgres"
HOST_SQL_PATH = "/Users/martin.adamec/work/direct/projects/script/db_strapi_backup_22.12_2026.sql"
CONTAINER_SQL_PATH = "/tmp/restore.sql"


def run(command):
    print(f"\n▶ Spouštím: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print("\n❌ Chyba při provádění příkazu.")
        sys.exit(1)


print("🚀 Spouštím obnovu databáze postgres_strapi")

# 1️⃣ Kopírování SQL do kontejneru
run(f'docker cp "{HOST_SQL_PATH}" {CONTAINER}:{CONTAINER_SQL_PATH}')

# 2️⃣ Ukončení aktivních připojení
run(
    f'docker exec -i {CONTAINER} psql -U {USER} -d template1 -c '
    f'"SELECT pg_terminate_backend(pid) FROM pg_stat_activity '
    f'WHERE datname = \'{DB}\' AND pid <> pg_backend_pid();"'
)

# 3️⃣ Drop DB
run(
    f'docker exec -i {CONTAINER} psql -U {USER} -d template1 -c '
    f'"DROP DATABASE IF EXISTS {DB};"'
)

# 4️⃣ Create DB
run(
    f'docker exec -i {CONTAINER} psql -U {USER} -d template1 -c '
    f'"CREATE DATABASE {DB};"'
)

# 5️⃣ Import SQL
run(
    f'docker exec -i {CONTAINER} psql -U {USER} -d {DB} '
    f'-v ON_ERROR_STOP=1 -f {CONTAINER_SQL_PATH}'
)

# 6️⃣ Ověření
run(
    f'docker exec -i {CONTAINER} psql -U {USER} -d {DB} -c "\\dt"'
)

print("\n🎉 Obnova databáze dokončena úspěšně!")
