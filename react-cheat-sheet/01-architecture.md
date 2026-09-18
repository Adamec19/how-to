# Architecture

## Feature-based struktura

Seskupuj kód podle domény nebo feature, ne pouze podle typu souboru:

```text
src/
├── app/                  # routes, layouty, composition root
├── components/           # globálně sdílené UI
├── lib/                  # obecné utility a infrastruktura
├── services/             # globální služby a integrace
└── features/
    ├── checkout/
    │   ├── components/
    │   ├── hooks/
    │   ├── models/
    │   ├── services/
    │   └── page.tsx
    └── profile/
```

## Směr závislostí

Preferuj tok:

```text
shared → features → app
```

Feature může používat shared vrstvu. Shared vrstva by neměla importovat konkrétní feature a dvě features by se neměly přímo spojovat. Pokud se logika používá na více místech, přesuň skutečně obecnou část do shared vrstvy.

## Server/client hranice

V frameworku se server/client boundary snaž držet co nejhlouběji:

- serverová komponenta připraví data a složí stránku;
- client komponenta vlastní interaktivitu, eventy a browser API;
- `use client` nepřidávej automaticky do celé feature.

```tsx
// page.tsx
export default async function Page() {
  const data = await loadData();
  return <InteractivePanel initialData={data} />;
}

// interactive-panel.tsx
"use client";

const InteractivePanel = ({ initialData }: Props) => {
  return <section>{initialData.title}</section>;
};

export { InteractivePanel };
```

## Praktický checklist

- Má každý modul jednu jasnou odpovědnost?
- Je business logika mimo route/layout soubory?
- Neimportuje shared kód konkrétní feature?
- Je client boundary pouze tam, kde je potřeba interaktivita?
- Lze feature testovat bez spuštění celé aplikace?
