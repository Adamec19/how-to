# Restore Databáze — postgres_strapi

## K čemu script slouží?

Script `restore_strapi.py` obnoví celou PostgreSQL databázi ze záložního `.sql` souboru do Docker kontejneru.

Používáš ho když:
- potřebuješ vrátit databázi do staršího stavu (ze zálohy)
- nastavuješ development prostředí od nuly
- něco pokazíš v DB a chceš čistý start

---

## Co script dělá? (krok po kroku)

1. Zkopíruje `.sql` zálohu ze tvého počítače do Docker kontejneru
2. Ukončí všechna aktivní připojení k databázi
3. Smaže stávající databázi (`DROP DATABASE`)
4. Vytvoří novou prázdnou databázi (`CREATE DATABASE`)
5. Naimportuje data ze zálohy (`.sql` soubor)
6. Ověří výsledek — vypíše seznam tabulek

---

## Konfigurace — co upravit před spuštěním

Otevři `restore_strapi.py` a zkontroluj tyto proměnné na začátku:

| Proměnná | Popis | Default |
|---|---|---|
| `CONTAINER` | název Docker kontejneru | `postgres_strapi` |
| `DB` | název databáze | `postgres_strapi` |
| `USER` | PostgreSQL user | `postgres` |
| `HOST_SQL_PATH` | **cesta k tvému `.sql` souboru** | ← toto měň nejčastěji |

**Příklad:**
```python
HOST_SQL_PATH = "/Users/martin.adamec/work/how-to/restore-db/db_strapi_backup_22.12_2026.sql"
```

---

## Jak spustit?

1. Ujisti se že Docker běží a kontejner je spuštěný:
```bash
docker ps
```

2. Spusť script:
```bash
python3 /Users/martin.adamec/work/how-to/restore-db/restore_strapi.py
```

---

## Požadavky

- Docker musí běžet
- Kontejner `postgres_strapi` musí být spuštěný
- Python 3 nainstalovaný (`python3 --version`)
- `.sql` záložní soubor musí existovat na cestě v `HOST_SQL_PATH`
