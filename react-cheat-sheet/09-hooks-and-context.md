# Hooks and Context

Hooks jsou funkce, které připojují komponentu ke konkrétní React schopnosti. Volají se pouze na nejvyšší úrovni komponenty nebo custom hooku — ne v podmínce, smyčce ani nested callbacku.

## Mentální model renderu

```text
props/state/context se změní
        ↓
React zavolá komponentu
        ↓
komponenta vrátí JSX
        ↓
React porovná nový a předchozí výstup
        ↓
DOM se aktualizuje
        ↓
effect se synchronizuje s externím systémem
```

Render má být čistý: nemá měnit DOM, volat API ani zapisovat do globální proměnné.

## `useState`

Pro lokální hodnotu, která mění UI.

```tsx
const [isOpen, setIsOpen] = useState(false);

setIsOpen(true);
setIsOpen((previous) => !previous);
```

Funkční updater použij, když nová hodnota závisí na předchozí hodnotě. State update je žádost o nový render, ne okamžitá mutace aktuální proměnné.

## `useReducer`

Pro složitější state, kde je více akcí a přechodů:

```tsx
type State = { status: "idle" | "loading" | "success" | "error" };
type Action = { type: "submit" } | { type: "success" } | { type: "error" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "submit": return { status: "loading" };
    case "success": return { status: "success" };
    case "error": return { status: "error" };
  }
};

const [state, dispatch] = useReducer(reducer, { status: "idle" });
```

Reducer centralizuje přechody. Neměl by volat API ani měnit externí systém.

## `useEffect`

Pro synchronizaci s něčím mimo React: subscription, timer, browser API, websocket nebo imperativní knihovna.

```tsx
useEffect(() => {
  document.title = title;
  return () => {
    document.title = "Aplikace";
  };
}, [title]);
```

Pokud pouze počítáš hodnotu z props/state, effect nepotřebuješ.

## `useRef`

Pro hodnotu, která má přežít render, ale její změna nemá vyvolat nový render. Typicky DOM node, timer id nebo předchozí hodnota.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};

return <input ref={inputRef} />;
```

Nemá nahrazovat state. Pokud změna hodnoty musí být vidět v UI, použij state.

## `useMemo`

Memoizuje výpočet, který je drahý nebo jehož stabilní reference je důležitá:

```tsx
const sortedItems = useMemo(
  () => [...items].sort(compareItems),
  [items]
);
```

Nepoužívej ho jako výchozí dekoraci každé proměnné. Nejprve musí existovat skutečný důvod.

## `useCallback`

Memoizuje funkci hlavně tehdy, když její identitu potřebuje memoizovaná child komponenta nebo dependency jiného hooku.

```tsx
const handleRemove = useCallback((id: string) => {
  removeItem(id);
}, [removeItem]);
```

Neřeší automaticky špatně navržený state ani nezrychlí každou komponentu.

## Další důležité hooks

### `useLayoutEffect`

Podobný jako `useEffect`, ale běží synchronně po změně DOM a před vykreslením browseru. Použij jen pro měření layoutu nebo vizuální opravu, aby uživatel neviděl bliknutí. Pro síť, subscription a běžnou synchronizaci preferuj `useEffect`.

### `useId`

Vytvoří stabilní unikátní ID pro propojení labelu, inputu a error message. Nepoužívej ho jako ID databázového záznamu ani jako náhradu za `key` v seznamu.

```tsx
const inputId = useId();

return (
  <>
    <label htmlFor={inputId}>E-mail</label>
    <input id={inputId} />
  </>
);
```

### `useTransition`

Označí update jako neurgentní, aby urgentní interakce zůstala responzivní. Neřeší loading API requestu; řeší prioritu renderu.

```tsx
const [isPending, startTransition] = useTransition();

const handleSearch = (value: string) => {
  startTransition(() => setSearch(value));
};
```

### `useDeferredValue`

Vytvoří odloženou verzi hodnoty pro drahé vykreslení. Původní hodnota se aktualizuje okamžitě, deferred hodnota může chvíli zaostávat.

## `useContext` a Provider

Context řeší předání hodnoty hluboko stromem bez prop drillingu. Není to automaticky globální store.

```tsx
type AuthValue = { user: User | null; logout: () => void };

const AuthContext = createContext<AuthValue | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const value = {
    user,
    logout: () => setUser(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
};

export { AuthProvider, useAuth };
```

Když se hodnota Provideru změní, znovu se vyrenderují komponenty, které context čtou. Proto je dobré rozdělit nesouvisející contexty a případně stabilizovat složité value.

V React 19 lze místo `.Provider` použít také `<AuthContext value={value}>`. Zápis s `.Provider` je širší a srozumitelnější pro codebase podporující více React verzí.

## Custom hook

Custom hook sdílí logiku, ne state instance. Každá komponenta, která ho zavolá, má vlastní hook state.

```tsx
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((current) => !current);

  return { value, toggle, setValue };
};

export { useToggle };
```

## Který hook zvolit?

| Potřeba | Hook |
|---|---|
| Hodnota měnící UI | `useState` |
| Více explicitních přechodů | `useReducer` |
| Synchronizace s externím systémem | `useEffect` |
| DOM node nebo mutable reference bez renderu | `useRef` |
| Drahý výpočet / stabilní hodnota | `useMemo` |
| Stabilní callback reference | `useCallback` |
| Hodnota dostupná hluboko stromem | `useContext` |
| Opakovaná state/effect logika | custom hook |

## Další čtení

- [React Hooks reference](https://react.dev/reference/react)
- [Built-in React Hooks](https://react.dev/reference/react/hooks)
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
