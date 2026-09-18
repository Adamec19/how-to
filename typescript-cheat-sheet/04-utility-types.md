# Utility Types

Utility types odvozují nové typy z existujících. Snižují duplicitu, ale neměly by skrýt důležitý business kontrakt.

## `Partial`, `Required`, `Readonly`

```ts
type User = {
  id: string;
  name: string;
  email: string;
};

type UserPatch = Partial<User>;
type CompleteUser = Required<User>;
type ImmutableUser = Readonly<User>;
```

`Partial` je vhodný například pro patch request, ne jako náhrada za přesný typ formuláře.

## `Pick` a `Omit`

```ts
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutEmail = Omit<User, "email">;
```

Použij je, pokud nový typ opravdu reprezentuje podmnožinu původního kontraktu.

## `Record`

```ts
type Permission = "read" | "write" | "delete";

const permissionLabels = {
  read: "Číst",
  write: "Upravovat",
  delete: "Mazat"
} satisfies Record<Permission, string>;
```

`Record` v kombinaci se `satisfies` hlídá, že nechybí žádný klíč a nepřibyl překlep.

## `ReturnType` a `Parameters`

```ts
const createUser = (name: string, role: string) => ({
  id: crypto.randomUUID(),
  name,
  role
});

type CreatedUser = ReturnType<typeof createUser>;
type CreateUserArgs = Parameters<typeof createUser>;
```

Tyto utility jsou užitečné, když je funkce zdrojem pravdy a nechceš ručně duplikovat její signaturu.

## `NonNullable`, `Extract`, `Exclude`

```ts
type MaybeUser = User | null | undefined;
type UserOnly = NonNullable<MaybeUser>;

type Events = "created" | "updated" | "deleted";
type WriteEvents = Extract<Events, "created" | "updated">;
type ReadOnlyEvents = Exclude<Events, "deleted">;
```

## `Awaited`

```ts
const loadUser = async () => ({ id: "1", name: "Ada" });
type LoadedUser = Awaited<ReturnType<typeof loadUser>>;
```

## Vlastní utility opatrně

Než vytvoříš nový utility type, zkus standardní utility, indexed access nebo `satisfies`. Vlastní typ má smysl, když se pattern opakuje a jeho název zlepší čitelnost.
