# Restore Databáze — postgres_strapi

Dva scripty pro práci s lokální Strapi databází:

| Script | K čemu |
|---|---|
| `restore_strapi.py` | Restore celé DB ze záložního `.sql` souboru |
| `seedDevData.js` | Naplnění čisté DB ukázkovými dev daty (Strapi v5) |

---

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

---

# Seed dev dat — seedDevData.js

## K čemu script slouží?

Naplní **čistou** lokální Strapi (v5) databázi ukázkovými daty. Hodí se, když starý `.sql` dump obsahuje nevalidní data a v5 Strapi s ním nenastartuje — místo restore ze zálohy vytvoříš čerstvá validní data.

Co vytvoří:
- 3 blog post categories, 2 page categories, 4 tags, 2 release-notes categories
- 1 placeholder obrázek (600×400 PNG, upload do `public/uploads`)
- 5 blog posts + 4 pages — jako draft, poté publikováno (v5 draft & publish dvojčata)

Data se vytvářejí přes **Strapi Documents API** (ne raw SQL), takže projdou všechny validace i lifecycles — `generatedUrl` se generuje správně, duplicate checky fungují.

## ⚠️ Pozor — co script NEdělá

- **Nic nemaže** — je nedestruktivní
- Je **idempotentní** — při opakovaném spuštění existující záznamy přeskočí (match podle slug/title)
- Nenahrává nic do cloudu — v development módu jde upload lokálně

## Konfigurace

| Proměnná | Popis | Default |
|---|---|---|
| `STRAPI_APP_DIR` | cesta ke Strapi projektu | `~/work/direct/projects/direct.cz-cms/strapi` |

Připojení k DB si bere z `.env` Strapi projektu (`DATABASE_URL`). Závislosti (`@strapi/strapi`, `dotenv`) načítá z `node_modules` Strapi projektu — v projektu musí být nainstalované (`yarn install`).

## Jak spustit?

1. Postgres kontejner musí běžet:
```bash
docker ps   # postgres_strapi
```

2. Spusť script (odkudkoliv):
```bash
node /Users/martin.adamec/work/how-to/restore-db/seedDevData.js
```

Jiná cesta ke Strapi projektu:
```bash
STRAPI_APP_DIR=/jina/cesta/strapi node seedDevData.js
```

## Typický workflow — čistý start s v5

```bash
# 1. vyčistit DB
docker exec postgres_strapi psql -U postgres -c "DROP DATABASE postgres_strapi WITH (FORCE);"
docker exec postgres_strapi psql -U postgres -c "CREATE DATABASE postgres_strapi;"

# 2. nastartovat Strapi — vytvoří schéma + pustí migrace
cd ~/work/direct/projects/direct.cz-cms/strapi && yarn develop

# 3. naplnit daty
node /Users/martin.adamec/work/how-to/restore-db/seedDevData.js
```

## Požadavky

- Docker + běžící kontejner `postgres_strapi`
- Strapi projekt s nainstalovanými závislostmi (`yarn install`)
- DB se schématem (alespoň jednou proběhlý `yarn develop`)
- Node.js
