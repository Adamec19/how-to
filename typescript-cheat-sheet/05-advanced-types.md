# Advanced Types

## Indexed access types

Z existujícího typu můžeš získat typ konkrétní property:

```ts
type Config = {
  api: { baseUrl: string; timeout: number };
  features: { payments: boolean };
};

type ApiConfig = Config["api"];
type FeatureFlags = Config["features"];
```

Pro pole `(typeof OPTIONS)[number]` znamená typ jednoho prvku pole.

## Mapped types

Mapped type projde klíče existujícího typu a vytvoří nový typ:

```ts
type Flags<T> = {
  [K in keyof T]: boolean;
};

type Form = { email: string; phone: string };
type FormTouched = Flags<Form>;
```

## Conditional types

Conditional type má tvar `T extends U ? A : B`:

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

type Email = { message: string };
type User = { name: string };

type EmailMessage = MessageOf<Email>;
type UserMessage = MessageOf<User>;
```

## `infer`

`infer` pojmenuje část typu uvnitř conditional type:

```ts
type UnwrapPromise<T> = T extends Promise<infer TValue> ? TValue : T;

type User = UnwrapPromise<Promise<{ id: string }>>;
```

Pokud conditional type začíná naked type parameterem, union se může distribuovat přes jednotlivé členy. To je užitečné, ale při složitých typech hůř čitelné.

## Template literal types

```ts
type Entity = "user" | "order";
type EventName = `${Entity}:created` | `${Entity}:updated`;

const eventName: EventName = "user:created";
```

Hodí se pro typování event názvů, route patterns nebo konfiguračních klíčů.

## `satisfies`

`satisfies` kontroluje, že hodnota odpovídá typu, ale zachová její konkrétní inference:

```ts
type Route = { title: string; authRequired: boolean };

const routes = {
  home: { title: "Domů", authRequired: false },
  account: { title: "Účet", authRequired: true }
} as const satisfies Record<string, Route>;

const accountTitle = routes.account.title;
```

Rozdíl oproti anotaci `const routes: Record<string, Route>` je v zachování konkrétních klíčů a literálů.

## Overloads

Overload může popsat více veřejných signatur jedné funkce. Implementace musí pokrýt všechny varianty:

```ts
type User = { id: string };

interface FindUser {
  (id: string): User | null;
  (ids: string[]): User[];
}

const findUser: FindUser = (value: string | string[]): User | User[] | null => {
  if (Array.isArray(value)) return value.map((id) => ({ id }));
  return { id: value };
};

export { findUser };
```

Overload použij jen tehdy, když jednotlivé signatury skutečně zlepšují API. Jinak bývá union jednodušší.
