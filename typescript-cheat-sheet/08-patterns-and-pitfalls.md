# Patterns and Pitfalls

## Preferuj discriminated unions před boolean kombinacemi

Méně bezpečné:

```ts
type Result = {
  isLoading: boolean;
  isError: boolean;
  data?: string[];
  error?: Error;
};
```

Lepší:

```ts
type Result =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };
```

Union zabrání neplatným kombinacím jako `isLoading: true` a současně `data`.

## Nepoužívej assertion jako validaci

```ts
const value = response as User;
```

`as User` pouze umlčí compiler. Data nezmění a neověří. Na externí vstup použij parser/schema nebo skutečný type guard.

## `satisfies` vs type assertion

```ts
type Config = { enabled: boolean };

const config = {
  enabled: true
} satisfies Config;
```

`satisfies` kontroluje kompatibilitu a zachová inference. `as Config` říká compileru „věř mi“ a může skrýt chybu.

## `as const` nepřidávej všude

`as const` dělá hodnotu readonly a zužuje literály. Použij ho pro konstantní konfigurace, mapy a seznamy hodnot. Nepoužívej ho jako automatickou opravu mutability erroru.

## `any` vs `unknown`

- `any`: compiler přestává kontrolovat hodnotu;
- `unknown`: compiler vyžaduje kontrolu před použitím;
- `never`: žádná možná hodnota.

Na hranicích aplikace preferuj `unknown`. Pokud musíš použít `any`, napiš proč a udrž jeho rozsah malý.

## Type duplication

Pokud stejný tvar existuje jako schema, response interface a UI type, časem se rozjede. Urči jeden zdroj pravdy a ostatní typy odvoď nebo mapuj.

## Overengineering

Nedělej conditional/mapped typ jen proto, že to jde. Typ má být čitelný pro dalšího člověka. Pokud je generic signature delší než implementace a nepřináší reálnou bezpečnost, zjednoduš ji.

## Naming

- `User`, `UserForm`, `UserResponse` pro role modelu;
- `UserStatus` pro union hodnot;
- `UserSchema` pro runtime schema;
- `parseUserResponse` pro parser;
- `toCreateUserRequest` pro mapper;
- `isUser` pro type guard.

## Review checklist

- Je typ skutečně zdrojem bezpečnosti, nebo jen assertion?
- Je union modelován tak, aby neumožnil neplatné stavy?
- Neuniká `any` do zbytku aplikace?
- Je generic nutný a čitelný?
- Je externí vstup runtime validovaný?
- Nezdvojuje se stejný kontrakt na více místech?
