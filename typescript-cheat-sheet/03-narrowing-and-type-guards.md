# Narrowing and Type Guards

Narrowing je proces, při kterém TypeScript zúží širší typ na konkrétnější variantu podle podmínky.

## `typeof`

```ts
const formatValue = (value: string | number): string => {
  if (typeof value === "number") {
    return value.toFixed(2);
  }

  return value.toUpperCase();
};

export { formatValue };
```

## Discriminated union

Přidej společný diskriminant, typicky `type` nebo `kind`:

```ts
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState = { status: "error"; error: Error };

type RequestState = LoadingState | SuccessState | ErrorState;

const renderState = (state: RequestState): string => {
  switch (state.status) {
    case "loading":
      return "Načítám";
    case "success":
      return state.data.join(", ");
    case "error":
      return state.error.message;
  }
};

export { renderState };
```

V každé větvi má TypeScript přesnou variantu a dovolí přístup jen k jejím vlastnostem.

## User-defined type guard

Type predicate ve tvaru `value is SomeType` naučí TypeScript výsledek vlastní kontroly:

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

const isFish = (animal: Fish | Bird): animal is Fish => {
  return "swim" in animal;
};

const move = (animal: Fish | Bird): void => {
  if (isFish(animal)) {
    animal.swim();
    return;
  }

  animal.fly();
};

export { isFish, move };
```

Type guard musí odpovídat realitě. Špatný predicate pouze přesvědčí compiler, ale nezmění runtime data.

## `in` a null check

```ts
const hasMessage = (value: unknown): value is { message: string } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
};

export { hasMessage };
```

## Exhaustiveness check

Když přidáš novou variantu do unionu, `assertNever` odhalí místa, která je potřeba doplnit:

```ts
const assertNever = (value: never): never => {
  throw new Error(`Unhandled state: ${String(value)}`);
};

const getLabel = (state: RequestState): string => {
  switch (state.status) {
    case "loading": return "Načítám";
    case "success": return "Hotovo";
    case "error": return "Chyba";
    default: return assertNever(state);
  }
};

export { getLabel };
```

## Checklist

- Má union společný diskriminant?
- Narrowuješ před přístupem ke specifické property?
- Je custom type guard skutečně ověřený za běhu?
- Pokryje `switch` všechny varianty?
