==============================================
  JAK LOKÁLNĚ PROLINKOVAT VYBUILDĚNÝ BALÍČEK
  (bez npm link)
==============================================

K ČEMU TO JE?
-------------
Máš lokálně vybuilděný npm balíček (vlastní knihovnu)
a chceš ho použít v jiném projektu — bez toho aniž bys
ho publishoval na npm registry.

Řešení: npm pack + přímá instalace z .tgz souboru.


POSTUP (obecný — funguje pro jakýkoliv balíček)
------------------------------------------------

KROK 1 — Vybuildi balíček
  Jdi do složky svého balíčku a spusť build:

    cd /cesta/k/tvemu/balicku
    npm run build

KROK 2 — Zapackuj balíček do .tgz
  Ve stejné složce spusť:

    npm pack

  Vytvoří soubor jako:  nazev-balicku-1.0.0.tgz
  (soubor se uloží přímo do aktuální složky)

KROK 3 — Nainstaluj .tgz do cílového projektu
  Jdi do projektu kde chceš balíček použít:

    cd /cesta/k/tvemu/projektu

  A nainstaluj přímo z absolutní cesty k .tgz:

    npm install /cesta/k/tvemu/balicku/nazev-balicku-1.0.0.tgz

  Nebo relativní cestou:

    npm install ../nazev-balicku/nazev-balicku-1.0.0.tgz


KONKRÉTNÍ PŘÍKLAD
-----------------
Balíček žije tady:
  /Users/martin.adamec/work/direct/packages/my-ui-kit

  cd /Users/martin.adamec/work/direct/packages/my-ui-kit
  npm run build
  npm pack
  # → vytvoří: my-ui-kit-1.0.0.tgz

Projekt kde ho chci použít:
  /Users/martin.adamec/work/direct/projects/my-app

  cd /Users/martin.adamec/work/direct/projects/my-app
  npm install /Users/martin.adamec/work/direct/packages/my-ui-kit/my-ui-kit-1.0.0.tgz


JAK TO VYPADÁ V package.json PROJEKTU?
---------------------------------------
Po instalaci se v package.json objeví:

  "dependencies": {
    "my-ui-kit": "file:../packages/my-ui-kit/my-ui-kit-1.0.0.tgz"
  }

To je správně — odkazuje na lokální soubor.


KDYŽ ZMĚNÍŠ BALÍČEK A CHCEŠ AKTUALIZOVAT
-----------------------------------------
  1. Jdi do složky balíčku
  2. npm run build
  3. npm pack                         ← vytvoří nové .tgz (přepíše staré)
  4. Jdi do projektu
  5. npm install /cesta/k/novemu.tgz  ← přeinstaluje novou verzi


PROČ NE npm link?
-----------------
  npm link vytvoří globální symlink — může způsobit problémy
  s verzemi závislostí (React hooks errors, duplicate instances apod.)

  npm pack + install je čistší a předvídatelnější.
  Chová se stejně jako instalace z npm registry.

==============================================
