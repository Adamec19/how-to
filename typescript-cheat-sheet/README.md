# TypeScript Cheat Sheet

Praktický průvodce TypeScriptem pro každodenní vývoj.

TypeScript kontroluje kód při buildu nebo v editoru. Nevaliduje automaticky data, která přijdou z API, formuláře nebo localStorage za běhu. Proto guide rozlišuje compile-time typy a runtime validaci.

## Obsah

| Téma | Kdy ho otevřít |
|---|---|
| [Type system basics](./01-type-system-basics.md) | Když řešíš základní typy, `unknown`, `any`, `never` nebo union |
| [Functions and generics](./02-functions-and-generics.md) | Když chceš typovat funkce, reusable helpery a generic komponenty |
| [Narrowing and type guards](./03-narrowing-and-type-guards.md) | Když pracuješ s union typem nebo daty z více variant |
| [Utility types](./04-utility-types.md) | Když potřebuješ odvodit nový typ z existujícího |
| [Advanced types](./05-advanced-types.md) | Když používáš mapped, conditional, indexed nebo template literal types |
| [API and runtime validation](./06-api-and-runtime-validation.md) | Když typuješ API, formuláře a externí data |
| [tsconfig and project setup](./07-tsconfig-and-project-setup.md) | Když nastavuješ strict mode, module resolution nebo project references |
| [Patterns and pitfalls](./08-patterns-and-pitfalls.md) | Když chceš vědět, čemu se vyhnout a jak psát čitelnější typy |
| [Snippets](./09-snippets.md) | Když potřebuješ rychlou kostru pro běžný typový pattern |

## Naše konvence ukázek

- Preferuj `type` pro skládání union/intersection typů a `interface` tam, kde skutečně potřebuješ rozšiřitelné objektové API.
- Funkce zapisuj jako `const` arrow functions.
- Named exporty dávej na konec ukázky.
- Nepoužívej `any` jako zkratku. Začni s `unknown` a data zuž nebo validuj.
- Typy odvozuj ze schema nebo zdroje pravdy; neduplikuj ručně stejný tvar na více místech.
- Pro config objekty preferuj `as const satisfies Shape`.

## Rychlý rozhodovací strom

1. Je hodnota zvenčí? Začni jako `unknown`.
2. Je to jedna z několika variant? Použij union a diskriminant.
3. Opakuje se algoritmus pro více typů? Zvaž generic.
4. Odvozuješ typ z existujícího typu? Použij utility nebo indexed access type.
5. Měníš typ podle podmínky? Použij conditional type, ale hlídej čitelnost.
6. Potřebuješ ověřit data za běhu? TypeScript nestačí, použij runtime schema/parser.

## Další čtení

- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
