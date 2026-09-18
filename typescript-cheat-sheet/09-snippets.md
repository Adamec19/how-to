# TypeScript Snippets

## `as const satisfies`

```ts
type ProductConfig = {
  label: string;
  enabled: boolean;
};

const PRODUCTS = {
  basic: { label: "Basic", enabled: true },
  premium: { label: "Premium", enabled: false }
} as const satisfies Record<string, ProductConfig>;

type ProductCode = keyof typeof PRODUCTS;
```

## Typed dictionary

```ts
type Status = "idle" | "loading" | "success" | "error";

const statusLabels = {
  idle: "Čeká",
  loading: "Načítá se",
  success: "Hotovo",
  error: "Chyba"
} satisfies Record<Status, string>;

export { statusLabels };
```

## Generic async result

```ts
type AsyncResult<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

const success = <T,>(data: T): AsyncResult<T> => ({ status: "success", data });

export { success };
```

## Type guard pro object

```ts
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export { isRecord };
```

## Exhaustive switch

```ts
type Action = { type: "save" } | { type: "cancel" };

const assertNever = (value: never): never => {
  throw new Error(`Unhandled action: ${String(value)}`);
};

const getActionLabel = (action: Action): string => {
  switch (action.type) {
    case "save": return "Uložit";
    case "cancel": return "Zrušit";
    default: return assertNever(action);
  }
};

export { getActionLabel };
```

## Branded type

Použij, když dvě hodnoty mají stejný runtime typ, ale nesmí se zaměnit:

```ts
type UserId = string & { readonly __brand: "UserId" };

const toUserId = (value: string): UserId => value as UserId;

const loadUser = (id: UserId) => fetch(`/users/${id}`);

export { toUserId, loadUser };
```

Branding není runtime validace. Je to compile-time ochrana proti záměně hodnot.

## `keyof` generic helper

```ts
const setProperty = <T, K extends keyof T>(object: T, key: K, value: T[K]): T => {
  return { ...object, [key]: value };
};

export { setProperty };
```

## Snippet checklist

- Je snippet copy-paste použitelný?
- Je explicitní, co je třeba přizpůsobit?
- Neobsahuje `any` bez vysvětlení?
- Má named export na konci?
- Je runtime boundary označená, pokud ji typy samy neřeší?
