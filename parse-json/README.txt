==============================================
  PARSE JSON — počítání komponent ve Strapi stránkách
==============================================

K ČEMU SCRIPT SLOUŽÍ?
---------------------
Script index.py prochází exportovaný JSON ze Strapi
a spočítá kolikrát se každá komponenta vyskytuje napříč
všemi stránkami.

Výsledek uloží do nového JSON souboru se statistikami.

Používáš ho když:
  - chceš vědět které Strapi komponenty jsou nejvíc používané
  - potřebuješ zjistit kde se jaká komponenta vyskytuje
  - plánuješ refactoring nebo migraci komponent
  - chceš mít přehled o stavu dat před větší změnou


CO SCRIPT DĚLÁ? (krok po kroku)
---------------------------------
  1. Načte vstupní .json soubor (export ze Strapi)
  2. Rekurzivně prochází každou stránku a hledá objekty
     s klíčem "__component"
  3. Pro každou komponentu počítá:
       - celkový počet výskytů
       - rozdělení podle hodnoty "publicWeb" (true/false/unknown)
  4. Uloží výsledky do výstupního .json souboru


KONFIGURACE — co upravit před spuštěním
-----------------------------------------
Na konci souboru index.py je volání funkce:

  count_components('strapi_pages.json', 'component_statistics.json')

  1. argument = vstupní JSON soubor  (tvůj Strapi export)
  2. argument = výstupní JSON soubor (sem se uloží statistiky)

Oba soubory musí být ve stejné složce jako script,
nebo zadej absolutní cestu.


JAK SPUSTIT?
------------
  1. Zkopíruj svůj Strapi JSON export do složky se scriptem:
       /Users/martin.adamec/work/how-to/parse-json/

  2. Uprav název vstupního souboru v index.py (pokud se liší)

  3. Spusť script:
       cd /Users/martin.adamec/work/how-to/parse-json
       python3 index.py

  4. Výsledek najdeš v:
       component_statistics.json


JAK VYPADÁ VÝSTUP?
------------------
Výstupní soubor component_statistics.json obsahuje:

  {
    "total_component_types": 12,        <- kolik různých typů komponent
    "total_components_processed": 347,  <- kolik komponent celkem
    "components": [
      {
        "name": "sections.hero",
        "total_count": 45,
        "public_web_breakdown": {
          "true": 30,
          "false": 15
        }
      },
      ...
    ]
  }


POŽADAVKY
---------
  - Python 3 nainstalovaný (python3 --version)
  - Vstupní JSON musí mít strukturu: { "data": [ ...stránky... ] }
  - Každá komponenta musí mít klíč "__component" (Strapi standard)

==============================================
