# Type System Basics

## Primitive types

```ts
const name: string = "Ada";
const age: number = 37;
const isActive: boolean = true;
const nothing: null = null;
const missing: undefined = undefined;
```

Ve většině případů nech inference pracovat:

```ts
const name = "Ada";
const age = 37;
```

Explicitní anotaci přidej tam, kde dokumentuje kontrakt, chrání veřejné API nebo pomáhá při narrowing.

## `type` a `interface`

```ts
type User = {
  id: string;
  name: string;
};

interface Repository<T> {
  findById(id: string): Promise<T | null>;
}
```

Praktické pravidlo:

- `type` je vhodný pro union, intersection, tuple, mapped a conditional typy;
- `interface` je vhodný pro objektový kontrakt, který se může rozšířit nebo implementovat;
- nejdůležitější je konzistence v jednom codebase.

## Union a literal types

```ts
type Status = "idle" | "loading" | "success" | "error";

const status: Status = "loading";
```

Union říká „jedna z povolených variant“. Je přesnější než obecný `string`.

## Optional vs nullable

```ts
type Profile = {
  nickname?: string;
  avatarUrl: string | null;
};
```

`nickname?` znamená, že property může chybět. `avatarUrl: string | null` znamená, že property existuje, ale hodnota může být explicitně prázdná. Nemíchej oba významy bez důvodu.

## `unknown` vs `any`

`unknown` je bezpečný typ pro data, kterým zatím nevěříš. Před použitím je musíš zúžit:

```ts
const parseJson = (value: string): unknown => JSON.parse(value);

const data = parseJson('{"name":"Ada"}');

if (typeof data === "object" && data !== null && "name" in data) {
  // Pro přesný kontrakt použij schema nebo type guard.
}
```

`any` vypíná typovou kontrolu a přenáší chybu dál. Použij ho pouze na skutečně nevyhnutelné hranici a izoluj ho.

## `never`

`never` popisuje hodnotu, která nemůže nastat, nebo funkci, která se nikdy úspěšně nevrátí:

```ts
const assertNever = (value: never): never => {
  throw new Error(`Unhandled value: ${String(value)}`);
};

export { assertNever };
```

Nejčastěji se používá pro exhaustiveness check ve `switch`.

## `as const`

Bez `as const` TypeScript často rozšíří hodnotu na obecný `string` nebo `number`. S `as const` zachová přesné literály a readonly vlastnosti:

```ts
const DIRECTIONS = ["up", "down", "left", "right"] as const;
type Direction = (typeof DIRECTIONS)[number];
```

## Checklist

- Je hodnota skutečně `string`, nebo omezený union literálů?
- Rozlišuješ `undefined` a `null` záměrně?
- Nezachraňuješ typový problém pomocí `any`?
- Je externí vstup nejdřív `unknown` a potom validovaný?
