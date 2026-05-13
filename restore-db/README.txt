==============================================
  RESTORE DATABÁZE — postgres_strapi
==============================================

K ČEMU SCRIPT SLOUŽÍ?
---------------------
Script restore_strapi.py obnoví celou PostgreSQL databázi
ze záložního .sql souboru do Docker kontejneru.

Používáš ho když:
  - potřebuješ vrátit databázi do staršího stavu (ze zálohy)
  - nastavuješ development prostředí od nuly
  - něco pokazíš v DB a chceš čistý start


CO SCRIPT DĚLÁ? (krok po kroku)
---------------------------------
  1. Zkopíruje .sql zálohu ze tvého počítače do Docker kontejneru
  2. Ukončí všechna aktivní připojení k databázi
  3. Smaže stávající databázi (DROP DATABASE)
  4. Vytvoří novou prázdnou databázi (CREATE DATABASE)
  5. Naimportuje data ze zálohy (.sql soubor)
  6. Ověří výsledek — vypíše seznam tabulek


KONFIGURACE — co upravit před spuštěním
-----------------------------------------
Otevři restore_strapi.py a zkontroluj tyto proměnné na začátku:

  CONTAINER       = název Docker kontejneru (default: "postgres_strapi")
  DB              = název databáze          (default: "postgres_strapi")
  USER            = PostgreSQL user         (default: "postgres")
  HOST_SQL_PATH   = CESTA K TVÉMU .sql SOUBORU  ← toto měň nejčastěji

Příklad:
  HOST_SQL_PATH = "/Users/martin.adamec/work/direct/projects/script/db_strapi_backup_22.12_2026.sql"


JAK SPUSTIT?
------------
  1. Ujisti se že Docker běží a kontejner postgres_strapi je spuštěný:
       docker ps

  2. Spusť script:
       python3 /Users/martin.adamec/work/how-to/restore-db/restore_strapi.py

     nebo pokud jsi ve složce how-to/restore-db:
       python3 restore_strapi.py


POŽADAVKY
---------
  - Docker musí běžet
  - Kontejner postgres_strapi musí být spuštěný
  - Python 3 nainstalovaný (python3 --version)
  - .sql záložní soubor musí existovat na cestě v HOST_SQL_PATH

==============================================
