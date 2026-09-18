# React Cheat Sheet

Praktický průvodce pro návrh a každodenní vývoj React aplikací.

Dokumentace rozlišuje obecné React principy od projektových konvencí, které je potřeba přizpůsobit konkrétnímu codebase.

## Obsah

| Téma | Kdy ho otevřít |
|---|---|
| [Architecture](./01-architecture.md) | Když zakládáš feature nebo rozhoduješ, kam kód patří |
| [Components](./02-components.md) | Když navrhuješ komponenty, props nebo reusable UI |
| [State and effects](./03-state-and-effects.md) | Když řešíš stav, odvozené hodnoty nebo `useEffect` |
| [Hooks and context](./09-hooks-and-context.md) | Když potřebuješ pochopit hlavní React hooks a sdílení hodnot |
| [Forms](./04-forms.md) | Když stavíš formulář, validaci nebo field wrapper |
| [Dialogs](./05-dialogs.md) | Když potřebuješ lokální nebo globální dialog systém |
| [API and data](./06-api-and-data.md) | Když propojuješ UI s API, cache a loading/error stavem |
| [Snippets and generators](./07-snippets-and-generators.md) | Když opakuješ stejnou strukturu nebo chceš scaffold |
| [Testing and review](./08-testing-and-review.md) | Když dokončuješ feature nebo reviewuješ změnu |
| [Component snippets](./10-component-snippets.md) | Když chceš rychle založit Context, Provider, hook nebo komponentu |

## Rychlý rozhodovací strom

1. Je to pouze vizuální prvek? Začni komponentou.
2. Je to stav platný jen pro jednu obrazovku? Použij lokální state.
3. Sdílí stav více vzdálených částí aplikace? Zvaž context nebo store.
4. Je hodnota odvoditelná z props/state? Vypočítej ji během renderu.
5. Synchronizuješ React s externím systémem? Použij `useEffect`.
6. Opakuje se struktura souborů a pravidel? Přidej snippet nebo generator.

## Zásada

Nejdříve navrhuj hranice a datový tok, potom abstrakce. Reusable komponenta má být jednoduchá na použití a neměla by znát business pravidla svého konzumenta.

## Konvence ukázek

Komponenty a custom hooks zapisujeme jako `const` arrow functions. Exporty jsou pojmenované a zapisují se na konci souboru:

```tsx
type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <section aria-labelledby="empty-state-title">
      <h2 id="empty-state-title">{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </section>
  );
};

export { EmptyState };
```

Stejný styl používají všechny snippets v této složce. Běžné pomocné funkce mohou mít vlastní konvenci podle konkrétního projektu, ale ukázky zde preferují stejný arrow-function zápis pro konzistenci.
