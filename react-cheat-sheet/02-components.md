# Components

## Komponenta jako kontrakt

Props definují veřejné API komponenty. Preferuj malé, explicitní props před univerzálním objektem plným volitelných hodnot.

```tsx
type SaveButtonProps = {
  disabled?: boolean;
  isSaving?: boolean;
  onSave: () => void;
};

const SaveButton = ({ disabled = false, isSaving = false, onSave }: SaveButtonProps) => {
  return (
    <button type="button" disabled={disabled || isSaving} onClick={onSave}>
      {isSaving ? "Ukládám…" : "Uložit"}
    </button>
  );
};

export { SaveButton };
```

## Controlled vs uncontrolled

Pokud rodič potřebuje znát nebo řídit hodnotu, použij controlled komponentu:

```tsx
type ToggleProps = { isOn: boolean; onChange: (isOn: boolean) => void };

const Toggle = ({ isOn, onChange }: ToggleProps) => {
  return <button onClick={() => onChange(!isOn)}>{isOn ? "On" : "Off"}</button>;
};

export { Toggle };
```

Nekopíruj props do lokálního state jen proto, aby se s nimi pohodlněji pracovalo. Vzniká synchronizační problém.

## Composition přes `children`

Vizuální wrapper nemá znát konkrétní obsah:

```tsx
const Card = ({ children }: { children: React.ReactNode }) => {
  return <article className="card">{children}</article>;
};

export { Card };

<Card>
  <UserSummary />
</Card>;
```

## Eventy a callbacky

- Event handler pojmenuj podle akce: `onSubmit`, `onRemove`, `onChange`.
- Callback drž u komponenty, která vlastní rozhodnutí.
- Neumisťuj business rozhodnutí do obecného Buttonu nebo Inputu.
- `useCallback` používej kvůli stabilní identitě předávané závislosti, ne automaticky.

## Reusable komponenta

Je vhodná, když má stabilní účel, jasný kontrakt a více reálných použití. Pokud se liší pouze dva řádky JSX, nejdřív zvaž composition; nevytvářej abstrakci jen kvůli DRY za každou cenu.
