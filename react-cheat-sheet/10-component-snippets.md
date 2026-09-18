# Component Snippets

Snippets jsou výchozí kostry. Vždy je přizpůsob accessibility, design systému, error handlingu a datovému kontraktu konkrétní aplikace.

## Base component

```tsx
type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <section aria-labelledby="empty-state-title">
      <h2 id="empty-state-title">{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </section>
  );
};

export { EmptyState };
```

## Compound component

Vhodné pro komponentu, jejíž části mají společný layout, ale konzument rozhoduje o obsahu:

```tsx
type SlotProps = { children: React.ReactNode };
type CardComponent = ((props: SlotProps) => React.ReactNode) & {
  Header: (props: SlotProps) => React.ReactNode;
  Body: (props: SlotProps) => React.ReactNode;
};

const Card = Object.assign(
  ({ children }: SlotProps) => <article className="card">{children}</article>,
  {
    Header: ({ children }: SlotProps) => <header>{children}</header>,
    Body: ({ children }: SlotProps) => <div>{children}</div>
  }
) satisfies CardComponent;
```

Použij pouze tehdy, když části opravdu patří k sobě. Jinak stačí `children` a běžné komponenty.

## Context + custom hook

```tsx
type CartContextValue = {
  count: number;
  add: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<string[]>([]);
  const value = {
    count: items.length,
    add: (productId: string) => setItems((current) => [...current, productId])
  };

  return <CartContext value={value}>{children}</CartContext>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

export { CartProvider, useCart };
```

## Controlled input

```tsx
type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <label>
      Hledat
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
};

export { SearchInput };
```

## Async state component

```tsx
if (isLoading) return <Loading />;
if (error) return <ErrorMessage error={error} />;
if (!data?.length) return <EmptyState title="Nic nenalezeno" />;

return <ResultList items={data} />;
```

Explicitní pořadí stavů je čitelnější než mnoho vnořených ternárních výrazů.

## Hook s cleanup

```tsx
const useWindowWidth = () => {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

export { useWindowWidth };
```

## Component checklist

- Má komponenta jeden účel?
- Je její veřejný kontrakt malý a typovaný?
- Je controlled/uncontrolled chování explicitní?
- Je keyboard a screen-reader chování vyřešené?
- Neobsahuje generická komponenta business logiku?
- Je potřeba Context, nebo stačí props/composition?
