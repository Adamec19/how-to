# Functions and Generics

## Typování funkcí

```ts
type FormatPrice = (value: number, currency: string) => string;

const formatPrice: FormatPrice = (value, currency) => {
  return `${value.toFixed(2)} ${currency}`;
};

export { formatPrice };
```

U veřejných helperů typuj vstupy i návratovou hodnotu. U lokálních funkcí může inference návratový typ bezpečně odvodit.

## Generic bez ztráty typu

Generic zachová vztah mezi vstupem a výstupem:

```ts
const first = <T,>(items: T[]): T | undefined => items[0];

const firstNumber = first([1, 2, 3]);
const firstName = first(["Ada", "Grace"]);
```

`<T,>` s čárkou je praktický zápis v `.tsx`, aby parser neinterpretoval generic jako JSX tag.

## Generic constraint

Použij `extends`, když generic potřebuje určitou schopnost:

```ts
type WithId = { id: string };

const getId = <T extends WithId>(value: T): string => value.id;

const userId = getId({ id: "user-1", name: "Ada" });
```

Constraint neříká, že `T` je přesně `WithId`; říká, že `T` musí mít alespoň jeho vlastnosti.

## Generics s `keyof`

```ts
const getProperty = <T, K extends keyof T>(object: T, key: K): T[K] => {
  return object[key];
};

const user = { id: "1", age: 37 };
const age = getProperty(user, "age");
```

`keyof T` je union klíčů typu `T` a `T[K]` je indexed access type pro hodnotu konkrétního klíče.

## Generic default

```ts
type ApiResult<TData = unknown> = {
  data: TData;
  error: Error | null;
};

const result: ApiResult<{ id: string }> = {
  data: { id: "1" },
  error: null
};
```

Default je vhodný pro pohodlné použití, ale nesmí zamaskovat chybějící typovou informaci.

## Generic komponenta

```tsx
type SelectProps<T> = {
  options: T[];
  getValue: (option: T) => string;
  getLabel: (option: T) => string;
  onChange: (option: T) => void;
};

const Select = <T,>({ options, getValue, getLabel, onChange }: SelectProps<T>) => {
  return (
    <select
      onChange={(event) => {
        const selected = options.find((option) => getValue(option) === event.target.value);
        if (selected) onChange(selected);
      }}
    >
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
};

export { Select };
```

## Kdy generic nepoužít

- když typ bude vždy jen jeden konkrétní typ;
- když generic pouze zhorší čitelnost;
- když řešíš business varianty, které mají být explicitním unionem;
- když by `unknown` a následné narrowing bylo srozumitelnější.

Generic má zachovat důležitý vztah mezi typy, ne vytvořit dojem flexibility.
