# API and Data

## Rozděl datový tok

```text
UI → form/domain model → request mapper → API client → response schema → UI model
```

Každá hranice má jiný účel. Form model nemusí být stejný jako API payload.

## Validuj externí data

```tsx
const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  roles: z.array(z.string())
});

const response = UserResponseSchema.parse(await fetchUser());
```

Externí data jsou `unknown`, dokud je neověří schema nebo bezpečný parser.

## Loading a error stav

Drž stav akce pohromadě:

```tsx
type RequestState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};
```

Neukazuj stará data jako čerstvá, pokud request selhal. Rozlišuj initial loading, refetch a mutation.

## Rušení závodících requestů

Pokud se requesty spouští rychle za sebou, starší odpověď nesmí přepsat novější stav:

```tsx
const controller = new AbortController();
previousController?.abort();
previousController = controller;

try {
  const result = await fetch(url, { signal: controller.signal });
  if (controller === previousController) setData(result);
} catch (error) {
  if (error instanceof DOMException && error.name === "AbortError") return;
  throw error;
}
```

## Cache keys

Cache key musí obsahovat všechny parametry, které mění výsledek. Jinak může komponenta zobrazit data z jiné varianty dotazu.

```tsx
queryKey: ["users", { organizationId, search, page }]
```
