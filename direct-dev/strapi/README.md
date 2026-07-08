# Strapi Database - Quick Commands

## Vytvoření Kontejnerů

### postgres_strapi (port 5432)
```bash
docker run -d --name postgres_strapi \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=direct \
  -e POSTGRES_DB=postgres_strapi \
  -p 5432:5432 \
  -v postgres_strapi_data:/var/lib/postgresql/data \
  postgres:15
```

### postgres_strapi_2 (port 5433)
```bash
docker run -d --hostname postgres_strapi_2 --name postgres_strapi_2 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=direct \
  -e POSTGRES_DB=postgres_strapi \
  -p 5433:5432 \
  -v postgres_strapi_2_data:/var/lib/postgresql/data \
  postgres:15.3-alpine3.18
```

---

## Import Dumpu

Spusť script:
```bash
python3 restore_db.py
```

Nebo manuálně:
```bash
docker cp /Users/martin.adamec/work/how-to/restore-db/db_strapi_backup_22.12_2026.sql postgres_strapi:/tmp/restore.sql
docker exec -i postgres_strapi psql -U postgres -d postgres_strapi -f /tmp/restore.sql
```

---

## Kopírování Hesla: postgres_strapi_2 → postgres_strapi

### 1. Zastavit postgres_strapi
```bash
docker stop postgres_strapi
```

### 2. Spustit čistý postgres_strapi_2
```bash
docker run -d --hostname postgres_strapi_2 --name postgres_strapi_2 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=direct \
  -e POSTGRES_DB=postgres_strapi \
  -p 5432:5432 \
  postgres:15.3-alpine3.18
```

### 3. Spustit Strapi a zaregistrovat se
```bash
npm run develop
```

### 4. Zkopírovat hash hesla
```bash
docker exec -it postgres_strapi_2 psql -U postgres -d postgres_strapi -c "SELECT email, password FROM admin_users;"
```

### 5. Zastavit Strapi a postgres_strapi_2
```
Ctrl + C
```
```bash
docker stop postgres_strapi_2
```

### 6. Spustit postgres_strapi
```bash
docker start postgres_strapi
```

### 7. Aktualizovat heslo (escapuj `$` jako `\$`)
```bash
docker exec -it postgres_strapi psql -U postgres -d postgres_strapi -c "UPDATE admin_users SET password = '\$2a\$10\$HASH' WHERE email = 'USER@EMAIL.cz';"
```

### 8. Spustit Strapi a přihlásit se
```bash
npm run develop
```

---

## Užitečné Příkazy

### Kontejnery
```bash
docker ps                    # běžící
docker ps -a                 # všechny
docker stop postgres_strapi  # zastavit
docker start postgres_strapi # spustit
```

### Databáze
```bash
# Zjistit databáze
docker exec -it postgres_strapi psql -U postgres -c "\l"

# Tabulky
docker exec -it postgres_strapi psql -U postgres -d postgres_strapi -c "\dt"

# Uživatelé
docker exec -it postgres_strapi psql -U postgres -d postgres_strapi -c "SELECT email FROM admin_users;"

# Smazat všechny uživatele
docker exec -it postgres_strapi psql -U postgres -d postgres_strapi -c "DELETE FROM admin_users;"

# Počet uživatelů
docker exec -it postgres_strapi psql -U postgres -d postgres_strapi -c "SELECT COUNT(*) FROM admin_users;"
```

---

## DBeaverAdding Connection

- **Host:** localhost
- **Port:** 5432 (postgres_strapi) nebo 5433 (postgres_strapi_2)
- **User:** postgres
- **Password:** direct
- **Database:** postgres_strapi

Refresh: Pravý klik → Invalidate/Reconnect → F5

---

*Cheat sheet pro práci s Strapi databázemi*