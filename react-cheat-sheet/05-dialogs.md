# Dialogs

Dialog není jen boolean `isOpen`. Je to malý systém, který řeší vlastnictví stavu, vykreslení, focus, zavření, obsah a často také přístupnost.

## Jak dialog teče aplikací

```text
uživatel klikne
      ↓
trigger zavolá openDialog(...) nebo setIsOpen(true)
      ↓
state se změní
      ↓
React znovu vyrenderuje dialog
      ↓
dialog nastaví focus, overlay a close handlers
      ↓
uživatel zavře dialog
      ↓
onOpenChange(false) → odstranění state → unmount
```

React stav je zdroj pravdy. Dialog by neměl být současně řízený `open` propem, vlastním nesynchronizovaným state a ještě globálním storem.

## Dvě běžné strategie

### Lokální dialog

Použij, když dialog patří jedné komponentě a jeho otevření není potřeba spouštět z více vzdálených míst.

```tsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Detail</button>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>Obsah dialogu</DialogContent>
    </Dialog>
  </>
);
```

### Globální dialog service

Hodí se pro opakované informační dialogy, confirm dialogy nebo situace, kdy trigger a render dialogu nejsou blízko sebe.

Princip:

```text
trigger → typed openDialog(type, props) → store → global renderer → dialog component
```

### Jednotlivé vrstvy

1. **Trigger** zná pouze akci, například `showHelp()`.
2. **Hook nebo service** sestaví title, content a callbacky.
3. **Store** drží seznam otevřených dialogů a jejich `id`.
4. **Provider** zpřístupní store React stromu.
5. **Global renderer** mapuje `type` na konkrétní Dialog komponentu.
6. **Dialog primitive** řeší overlay, focus trap, Escape, kliknutí mimo obsah a animaci.

Tohle rozdělení dovolí měnit vizuální implementaci bez úprav všech triggerů.

## Minimal typed store

```tsx
type DialogMap = {
  info: { title: string; content: React.ReactNode };
  confirm: { title: string; onConfirm: () => void };
};

type Dialog = {
  [K in keyof DialogMap]: { id: string; type: K; props: DialogMap[K] };
}[keyof DialogMap];

type DialogStore = {
  dialogs: Dialog[];
  openDialog: <T extends keyof DialogMap>(type: T, props: DialogMap[T]) => string;
  closeDialog: (id: string) => void;
};
```

Výhody:

- props dialogu jsou typované podle `type`;
- renderer nemusí znát každý trigger;
- dialog lze zobrazit z hooku nebo utility vrstvy;
- každý otevřený dialog má vlastní `id`.

## Feature hook

Nevolej globální store přímo na desítkách míst s opakovaným textem. Vytvoř feature hook, který schová názvy překladů a tvar obsahu:

```tsx
const useHelpDialogs = () => {
  const { openDialog } = useDialogStore();
  const t = useTranslations("help");

  return {
    payment: () =>
      openDialog("info", {
        title: t("payment.title"),
        content: t("payment.content")
      })
  };
};

export { useHelpDialogs };
```

## Kritické detaily

- Provider musí obalit všechny triggery i globální renderer.
- Renderer musí po zavření odstranit konkrétní `id`.
- `onOpenChange` kombinuj s interním close handlerem, nepřepisuj ho tiše.
- Interaktivní confirm dialog musí po potvrzení zavřít dialog a teprve potom provést akci podle potřeby.
- Portál může změnit React context hranici. Pokud dialog potřebuje feature store, explicitně mu předej store nebo renderuj dialog uvnitř správného provideru.
- Překlady drž v i18n vrstvě, ne v global store.

## Portal a React tree

Dialog se často vykresluje přes `createPortal(..., document.body)`, aby nebyl oříznutý rodičovským `overflow: hidden` nebo lokálním stacking contextem.

Portál mění fyzické místo v DOM, ale nemění React strom. Dialog proto stále vidí React context z místa, kde byl vyrenderovaný, a eventy se propagují podle React stromu. To je důvod, proč může portal dialog přistupovat ke Contextu — ale také proč může click event probublat k rodičům.

```tsx
"use client";

import { createPortal } from "react-dom";

const Modal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(
    <div role="dialog" aria-modal="true">
      {children}
    </div>,
    document.body
  );
};

export { Modal };
```

Portal se vytváří pouze v client komponentě, protože `document.body` na serveru neexistuje. Samotný portal neřeší focus trap ani ARIA — to musí dodat dialog primitive nebo vlastní implementace.

## Accessibility checklist

- dialog má `role="dialog"` a `aria-modal="true"`;
- má přístupný title přes `aria-labelledby` nebo textový label;
- po otevření dostane focus smysluplný prvek;
- Escape dialog zavře, pokud to není záměrně zakázané;
- focus se po zavření vrátí na trigger;
- overlay a close button mají jasný keyboard behavior;
- dialog se nepoužívá pro běžný obsah, který může být přímo na stránce.

## Kdy globální dialog nepoužít

Nepoužívej globální service jen proto, že je kratší než lokální state. Lokální dialog je čitelnější, pokud:

- dialog používá jen jedna komponenta;
- jeho obsah závisí na lokálním state;
- nepotřebuje být otevřený z více vzdálených míst;
- není nutné řídit více dialogů jako stack.
