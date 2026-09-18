# tsconfig and Project Setup

## Strict mode

Začni na `strict: true`. TypeScript pak zapne sadu kontrol, které odhalí mnoho problémů dříve:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Nejdůležitější dopad je `strictNullChecks`: `null` a `undefined` už nejsou automaticky kompatibilní s každým typem.

## Praktický základ

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "skipLibCheck": true
  }
}
```

Konkrétní `target`, module a resolution musí odpovídat runtime a bundleru. Nekopíruj config bez pochopení prostředí.

## `noUncheckedIndexedAccess`

Bez této volby TypeScript často považuje `items[0]` za jistý prvek. Se zapnutou volbou dostaneš `T | undefined` a musíš ošetřit prázdné pole.

```ts
const first = (items: string[]): string | undefined => items[0];
```

## `include`, `exclude` a project references

`include` určuje zdrojové soubory projektu. `exclude` není bezpečnostní hranice — importovaný soubor se může do programu stále dostat.

Project references použij až ve chvíli, kdy máš více samostatně buildovaných TypeScript projektů. Pro běžnou aplikaci je jeden dobře nastavený `tsconfig` jednodušší.

## Aliases

Path alias řeš společně s bundlerem, test runnerem a editor toolingem. Alias v `tsconfig` sám o sobě nemění runtime resolution.

## Verification commands

```sh
tsc --noEmit
```

Typový check by měl běžet v CI. Lint a formatter řeší jinou vrstvu než TypeScript compiler; jeden nenahrazuje druhý.

## Co do `tsconfig` nepatří

- potlačení všech chyb přes `strict: false`;
- plošné `skipLibCheck` jako oprava vlastního typu;
- aliasy bez konfigurace bundleru/testů;
- náhodné přidávání compiler options bez ověření dopadu.
