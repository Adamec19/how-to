# Snippets and Generators

## Kdy vytvořit snippet

Snippet se hodí pro malý, stabilní a často opakovaný kus kódu:

- `Controller` field wrapper;
- loading/error state;
- typed dialog hook;
- testovací setup;
- standardní feature index.

Snippet nemá skrývat rozhodnutí, která musí vývojář udělat ručně.

## Kdy vytvořit generator

Generator použij, pokud se opakuje více souborů a jejich vzájemná konfigurace:

```text
feature-name/
├── components/
├── hooks/
├── models/schema.ts
├── services/api/
└── page.tsx
```

Generator má vytvořit konzistentní základ, ne zamknout celý další vývoj.

## Template placeholdery

Drž placeholdery explicitní a snadno vyhledatelné:

```text
{{FEATURE_NAME}}
{{FEATURE_TITLE}}
{{API_RESOURCE}}
```

Po generování vždy ověř:

- import paths;
- názvy exportů;
- překlady a route registraci;
- typy a lint;
- že nevznikly placeholdery v produkčním kódu.

## Minimal TypeScript scaffold

```tsx
type FeatureProps = {
  initialData: FeatureData;
};

const Feature = ({ initialData }: FeatureProps) => {
  return <section>{initialData.title}</section>;
};

export { Feature };
```

Začni minimální verzí. Další abstraction přidávej až ve chvíli, kdy existují dva nebo tři skutečné use cases.
