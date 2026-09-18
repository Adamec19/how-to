# State and Effects

## Kde má být state

Použij nejnižší místo ve stromu, které state potřebuje:

- pouze jedna komponenta: `useState`;
- více sourozenců: lift state do společného rodiče;
- vzdálené části jedné oblasti: context nebo feature store;
- serverová data: query/cache vrstva, ne ruční globální state.

## Odvozené hodnoty nejsou state

```tsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");

const fullName = `${firstName} ${lastName}`.trim();
```

Nevytvářej `fullName` jako state a neaktualizuj ho v `useEffect`. To pouze duplikuje zdroj pravdy.

## Kdy použít `useEffect`

Effect je určený pro synchronizaci s externím systémem:

- subscription nebo event listener;
- timer;
- browser API;
- síťové nebo jiné imperativní API.

```tsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();

  return () => connection.disconnect();
}, [roomId]);
```

Cleanup musí zrušit přesně to, co effect vytvořil.

## Časté chyby

- Effect, který pouze přepočítává hodnotu z props/state.
- Effect bez cleanup pro listener nebo timer.
- Globální store pro krátkodobý stav dialogu jedné komponenty.
- Více zdrojů pravdy pro stejnou hodnotu.
- Závislosti vynechané jen proto, aby effect běžel méně často.
