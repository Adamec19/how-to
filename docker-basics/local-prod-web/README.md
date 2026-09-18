# Lokální spuštění produkčního buildu podobně jako v Dockeru

Tento postup ukazuje, jak lokálně spustit aplikaci podobně jako v produkčním
Docker image. Hodí se pro projekty, které se v Dockeru sestavují jako Next.js
`standalone` build a následně se spouštějí přes Node.js server.

Skript [`run-local-prod.sh`](./run-local-prod.sh) Docker nepouští. Pouze
napodobí důležité části produkčního Dockerfile přímo na počítači:

- použije vybraný produkční env soubor,
- nainstaluje stejné závislosti,
- vytvoří produkční `standalone` build,
- přidá statické soubory,
- spustí výsledný Node.js server.

Výsledkem je lokální běh produkčního buildu bez nutnosti vytvářet a spouštět
Docker image.

## Předpoklady

- projekt s `package.json`, příkazem `pnpm build` a Next.js standalone outputem
- Node.js a Corepack
- přístup k repozitáři a jeho závislostem
- připravený env soubor v projektu nebo v jeho adresáři `envs/`

Skript předpokládá také standardní strukturu Next.js buildu:

```text
.next/standalone/server.js
.next/static/
public/
```

Pokud jiný projekt používá jiný build output, je potřeba skript upravit.

## Obecné použití

### Rychlý příklad spuštění

```bash
cd /Users/martin.adamec/work/how-to/docker-basics/local-prod-web
./run-local-prod.sh /cesta/k/projektu .env.PROD
```

Skript zůstane běžet a aplikace bude dostupná na
`http://localhost:3000`. Ukončíš ho pomocí `Ctrl+C`.

Skript lze spustit také z libovolného adresáře absolutní cestou:

```bash
/Users/martin.adamec/work/how-to/docker-basics/local-prod-web/run-local-prod.sh \
  /cesta/k/projektu \
  .env.PROD
```

### Parametry

První argument je cesta ke kořenu projektu. Skript se do tohoto adresáře
přepne, takže ho lze spouštět z libovolného místa. Pokud argument není uvedený,
použije se aktuální adresář:

```bash
./run-local-prod.sh
```

Druhý argument je název nebo cesta k env souboru. Název se hledá přímo
v projektu a také v jeho adresáři `envs/`. Bez druhého argumentu se použije:

```text
envs/.env.PUBLIC_WEB_PROD
```

Příklady:

```bash
# envs/.env.PROD v projektu
./run-local-prod.sh /cesta/k/projektu .env.PROD

# env soubor přímo v kořenu projektu
./run-local-prod.sh /cesta/k/projektu .env

# explicitní relativní nebo absolutní cesta
./run-local-prod.sh /cesta/k/projektu envs/.env.PROD
./run-local-prod.sh /cesta/k/projektu /cesta/k/env/.env.PROD
```

Po úspěšném spuštění je web dostupný na:

```text
http://localhost:3000
```

Server se ukončí klávesovou zkratkou `Ctrl+C`.

## Co skript dělá krok za krokem

1. Přepne se do kořene předaného projektu.
2. Ověří, že požadovaný env soubor existuje.
3. Pokud existuje lokální `.env`, dočasně ho přesune do
   `.env.before-local-prod`, aby ho build nepřepsal.
4. Zkopíruje vybraný env soubor do `.env`, protože aplikace i build očekávají
   env soubor právě na tomto místě.
5. Zapne Corepack a nainstaluje závislosti přes
   `pnpm install --frozen-lockfile`.
6. Vytvoří produkční build pomocí `pnpm build`.
7. Zkopíruje `.next/static` a `public` do `.next/standalone`, stejně jako to
   dělá produkční Docker image.
8. Spustí `.next/standalone/server.js` přes Node.js.
9. Nastaví lokální URL na `http://localhost:3000` a vypne Redis cache.
10. Po ukončení procesu odstraní dočasný `.env` a obnoví původní `.env`.

Tento postup tedy netestuje pouze zdrojový kód v development režimu. Testuje
to, co vznikne po produkčním buildu, včetně standalone serveru a statických
souborů.

## Bezpečnostní pojistky skriptu

- Pokud vybraný env soubor neexistuje, skript skončí s chybou.
- Pokud už existuje `.env.before-local-prod`, skript nespustí další běh, aby
  zálohu nepřepsal.
- Původní `.env` se obnovuje automaticky i při ukončení serveru přes
  `Ctrl+C`.

Pokud předchozí běh skončil neobvyklým způsobem a záloha zůstala na místě,
nejdříve ji zkontroluj:

```bash
ls -l .env .env.before-local-prod
```

Teprve potom případně zálohu ručně přesuň nebo odstraň.

## Co je potřeba upravit pro jiný projekt

Skript je obecný pro projekty se stejným typem Next.js standalone buildu. Pro
jiný projekt si zkontroluj hlavně:

- zda používá `pnpm` a příkaz `pnpm build`,
- zda vytváří `.next/standalone/server.js`,
- zda potřebuje kopírovat `public` a `.next/static`,
- zda používá `.env` jako vstupní env soubor,
- zda má jiné výchozí URL, port nebo cache.

Pokud se liší pouze umístění projektu nebo env souboru, není potřeba skript
měnit — stačí použít argumenty.

## Rozdíl oproti běžnému vývoji

Pro běžný vývoj s hot reloadem použij standardní příkaz:

```bash
pnpm dev
```

`run-local-prod.sh` je určený pro ověření produkčního buildu a runtime chování
standalone serveru. Změny ve zdrojových souborech se po vytvoření buildu
automaticky neprojeví; po změnách je potřeba skript spustit znovu.

## Konkrétní příklad: `direct-public-web`

V `direct-public-web` se produkční Docker image sestavuje s env souborem
z adresáře `envs/` a používá Next.js standalone output. Proto lze sdílený
skript spustit takto:

```bash
/Users/martin.adamec/work/how-to/docker-basics/local-prod-web/run-local-prod.sh \
  /Users/martin.adamec/work/direct/projects/direct-public-web \
  .env.PUBLIC_WEB_PROD
```

Pro DEV variantu:

```bash
/Users/martin.adamec/work/how-to/docker-basics/local-prod-web/run-local-prod.sh \
  /Users/martin.adamec/work/direct/projects/direct-public-web \
  .env.PUBLIC_WEB_DEV
```

V tomto konkrétním případě skript odpovídá hlavním krokům v
`direct-public-web/docker/Dockerfile`: použije env konfiguraci, vytvoří build,
doplní `public` a `.next/static` do standalone výstupu a spustí
`server.js`. Rozdíl je v tom, že všechny kroky proběhnou přímo na hostitelském
počítači, ne uvnitř Docker image.
