# Link Local Package

Jak lokálně prolinkovat vybuilděný balíček bez `npm link`.

## K čemu to je?

Máš lokálně vybuilděný npm balíček (vlastní knihovnu) a chceš ho použít v jiném projektu — bez toho aniž bys ho publishoval na npm.

**Řešení:** `npm pack` + přímá instalace z `.tgz` souboru.

---

## Postup (obecný — funguje pro jakýkoliv balíček)

### Krok 1 — Vybuildi balíček
```bash
cd /cesta/k/tvemu/balicku
npm run build
```

### Krok 2 — Zapackuj balíček do `.tgz`
```bash
npm pack
```
Vytvoří soubor jako `nazev-balicku-1.0.0.tgz` přímo v aktuální složce.

### Krok 3 — Nainstaluj `.tgz` do cílového projektu
```bash
cd /cesta/k/tvemu/projektu

# absolutní cestou
npm install /cesta/k/tvemu/balicku/nazev-balicku-1.0.0.tgz

# nebo relativní cestou
npm install ../nazev-balicku/nazev-balicku-1.0.0.tgz
```

---

## Konkrétní příklad

```bash
# 1. build + pack
cd /Users/martin.adamec/work/direct/packages/my-ui-kit
npm run build
npm pack
# → vytvoří: my-ui-kit-1.0.0.tgz

# 2. instalace do projektu
cd /Users/martin.adamec/work/direct/projects/my-app
npm install /Users/martin.adamec/work/direct/packages/my-ui-kit/my-ui-kit-1.0.0.tgz
```

---

## Jak to vypadá v `package.json`?

Po instalaci se v `package.json` objeví:
```json
"dependencies": {
  "my-ui-kit": "file:../packages/my-ui-kit/my-ui-kit-1.0.0.tgz"
}
```

---

## Když změníš balíček a chceš aktualizovat

```bash
cd /cesta/k/balicku
npm run build
npm pack                          # přepíše staré .tgz

cd /cesta/k/projektu
npm install /cesta/k/novemu.tgz   # přeinstaluje novou verzi
```

---

## Proč ne `npm link`?

`npm link` vytvoří globální symlink — může způsobit problémy s verzemi závislostí (React hooks errors, duplicate instances apod.).

`npm pack` + install je čistší a předvídatelnější. Chová se stejně jako instalace z npm registry.
