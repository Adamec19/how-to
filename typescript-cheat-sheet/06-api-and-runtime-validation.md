# API and Runtime Validation

## Compile-time není runtime

Tento typ chrání pouze kód, který píšeš v TypeScriptu:

```ts
type User = {
  id: string;
  name: string;
};

const user: User = await fetchUser();
```

TypeScript nemůže zaručit, že server skutečně vrátil `{ id, name }`. Data z HTTP, JSON, localStorage, query params nebo `postMessage` jsou nedůvěryhodná, dokud je za běhu neověříš.

## API boundary

Drž datový tok oddělený:

```text
unknown response
  → runtime schema/parser
  → validated API model
  → mapper
  → UI/domain model
```

Form model, API request a API response nemusí být stejný typ. Převod mezi nimi je záměrná hranice, ne zbytečná duplicita.

## Zod schema

```ts
import { z } from "zod/v4";

const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  roles: z.array(z.string())
});

type UserResponse = z.infer<typeof UserResponseSchema>;

const parseUserResponse = (value: unknown): UserResponse => {
  return UserResponseSchema.parse(value);
};

export { UserResponseSchema, parseUserResponse };
```

Schema je zdroj runtime validace i TypeScript typu. Typ odvoď přes `z.infer`, aby se schema a ručně napsaný typ nerozcházely.

## `parse` vs `safeParse`

```ts
const parseUserResponseSafe = (value: unknown) => {
  const result = UserResponseSchema.safeParse(value);

  if (!result.success) {
    return { data: null, error: result.error };
  }

  return { data: result.data, error: null };
};

export { parseUserResponseSafe };
```

- `parse` vyhodí výjimku — hodí se tam, kde je nevalidní response skutečně failure;
- `safeParse` vrátí výsledek — hodí se pro formuláře, fallback nebo uživatelskou chybu.

## Request mapper

```ts
type UserForm = {
  firstName: string;
  lastName: string;
};

type CreateUserRequest = {
  name: string;
};

const toCreateUserRequest = (form: UserForm): CreateUserRequest => ({
  name: `${form.firstName} ${form.lastName}`.trim()
});

export { toCreateUserRequest };
```

Mapper je dobré místo pro normalizaci, transformaci a explicitní API kontrakt. Neumisťuj ho do JSX event handleru.

## Error jako `unknown`

```ts
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Nastala neočekávaná chyba";
};

export { getErrorMessage };
```

`catch (error)` považuj za `unknown`. Ne všechny thrown hodnoty jsou instance `Error`.

## Checklist API hranice

- Je response validovaná za běhu?
- Je schema zdrojem odvozeného typu?
- Je request oddělený od form/UI modelu?
- Je error zúžený z `unknown`?
- Je fallback chování explicitní?
