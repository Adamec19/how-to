# cp-dist-workflow — lokální propojení npm balíčku

Jak použít lokálně vybuilděný balíček v jiném projektu bez publikování na npm.

---

## Způsob: přímé kopírování `dist` složky

Nejjednodušší přístup — žádný `npm link`, žádný `npm pack`. Stačí zkopírovat `dist` rovnou do `node_modules` cílového projektu.

### Postup

**1. Udělej změny v balíčku a vybuildi ho:**
```bash
cd ~/work/direct/projects/direct-react-components
# ... udělej změny ...
yarn build
```

**2. Smaž starou `dist` v cílovém projektu:**
```bash
rm -rf ~/work/direct/projects/direct-insurance-forms/node_modules/@direct/react-components/dist
```

**3. Zkopíruj novou `dist` do cílového projektu:**
```bash
cp -R ~/work/direct/projects/direct-react-components/dist ~/work/direct/projects/direct-insurance-forms/node_modules/@direct/react-components/
```

**4. Přepni do cílového projektu a restartuj dev server:**
```bash
cd ~/work/direct/projects/direct-insurance-forms
rm -rf .next
yarn dev
```

---

## Obecný tvar příkazů

```bash
# Smazat starou dist
rm -rf <cílový-projekt>/node_modules/<název-balíčku>/dist

# Zkopírovat novou dist
cp -R <zdrojový-balíček>/dist <cílový-projekt>/node_modules/<název-balíčku>/

# Restart dev serveru (Next.js)
rm -rf .next && yarn dev
```

---

## Proč `rm -rf .next`?

Next.js cachuje moduly — bez smazání `.next` by se změny nemusely projevit.

---

## ⚠️ Pozor

- Změny v `node_modules` jsou **dočasné** — po `yarn install` / `npm install` se přepíší zpět
- Tento postup je čistě pro **lokální vývoj a testování**
- Funguje pouze pokud balíček builduje do `dist` složky
