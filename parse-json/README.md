# Parse JSON — počítání komponent ve Strapi stránkách

## K čemu script slouží?

Script `index.py` prochází exportovaný JSON ze Strapi a spočítá kolikrát se každá komponenta vyskytuje napříč všemi stránkami. Výsledek uloží do nového JSON souboru se statistikami.

Používáš ho když:
- chceš vědět které Strapi komponenty jsou nejvíc používané
- potřebuješ zjistit kde se jaká komponenta vyskytuje
- plánuješ refactoring nebo migraci komponent
- chceš mít přehled o stavu dat před větší změnou

---

## Co script dělá? (krok po kroku)

1. Načte vstupní `.json` soubor (export ze Strapi)
2. Rekurzivně prochází každou stránku a hledá objekty s klíčem `__component`
3. Pro každou komponentu počítá:
   - celkový počet výskytů
   - rozdělení podle hodnoty `publicWeb` (true/false/unknown)
4. Uloží výsledky do výstupního `.json` souboru

---

## Konfigurace — co upravit před spuštěním

Na konci souboru `index.py` je volání funkce:

```python
count_components('strapi_pages.json', 'component_statistics.json')
```

- **1. argument** = vstupní JSON soubor (tvůj Strapi export)
- **2. argument** = výstupní JSON soubor (sem se uloží statistiky)

Oba soubory musí být ve stejné složce jako script, nebo zadej absolutní cestu.

---

## Jak spustit?

```bash
# 1. Zkopíruj Strapi JSON export do složky se scriptem
# 2. Uprav název vstupního souboru v index.py (pokud se liší)
# 3. Spusť script
cd /Users/martin.adamec/work/how-to/parse-json
python3 index.py
```

Výsledek najdeš v `component_statistics.json`.

---

## Jak vypadá výstup?

```json
{
  "total_component_types": 12,
  "total_components_processed": 347,
  "components": [
    {
      "name": "sections.hero",
      "total_count": 45,
      "public_web_breakdown": {
        "true": 30,
        "false": 15
      }
    }
  ]
}
```

---

## Požadavky

- Python 3 (`python3 --version`)
- Vstupní JSON musí mít strukturu: `{ "data": [ ...stránky... ] }`
- Každá komponenta musí mít klíč `__component` (Strapi standard)
