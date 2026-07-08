# algorithms — přehled základních algoritmů pro vývojáře

Praktický přehled nejdůležitějších algoritmů s příklady v TypeScriptu. Každý algoritmus obsahuje vysvětlení, kód a časovou složitost.

---

## Časová složitost — přehled

| Notace | Název | Příklad |
|--------|-------|---------|
| O(1) | konstantní | přístup k prvku pole |
| O(log n) | logaritmická | binary search |
| O(n) | lineární | linear search |
| O(n log n) | linearitmická | merge sort, quick sort |
| O(n²) | kvadratická | bubble sort, insertion sort |
| O(2ⁿ) | exponenciální | rekurzivní Fibonacci bez cache |

---

## Řadící algoritmy (Sorting)

---

### Bubble Sort — O(n²)

**Idea:** Porovnáváme vždy dva sousední prvky. Pokud je levý větší než pravý, prohodíme je. Opakujeme dokud není pole seřazené. Největší prvek "probublá" na konec po každém průchodu.

**Krok za krokem na příkladu `[5, 3, 8, 1, 2]`:**

```
Pass 0 — projdeme celé pole:
  [5, 3, 8, 1, 2]  →  5 > 3 ? ANO → prohoď  →  [3, 5, 8, 1, 2]
  [3, 5, 8, 1, 2]  →  5 > 8 ? NE  → nechej   →  [3, 5, 8, 1, 2]
  [3, 5, 8, 1, 2]  →  8 > 1 ? ANO → prohoď  →  [3, 5, 1, 8, 2]
  [3, 5, 1, 8, 2]  →  8 > 2 ? ANO → prohoď  →  [3, 5, 1, 2, 8]
  ✓ Největší číslo (8) je teď na konci — tuto pozici už nikdy nekontrolujeme.

Pass 1 — projdeme pole bez posledního prvku:
  [3, 5, 1, 2, 8]  →  3 > 5 ? NE  →  [3, 5, 1, 2, 8]
  [3, 5, 1, 2, 8]  →  5 > 1 ? ANO →  [3, 1, 5, 2, 8]
  [3, 1, 5, 2, 8]  →  5 > 2 ? ANO →  [3, 1, 2, 5, 8]
  ✓ Druhé největší (5) je na svém místě.

... a tak dále dokud je pole seřazené.
Výsledek: [1, 2, 3, 5, 8]
```

**Co znamenají proměnné:**
- `pass` — kolikátý průchod celým polem právě děláme. Po každém průchodu víme, že posledních `pass` prvků je seřazených, takže je přeskakujeme.
- `current` — index prvku, který právě porovnáváme se svým pravým sousedem (`current + 1`).

```typescript
function bubbleSort(numbers: number[]): number[] {
  const sorted = [...numbers]; // kopie, nechceme měnit původní pole

  for (let pass = 0; pass < sorted.length; pass++) {
    // Po každém `pass` je posledních `pass` prvků již seřazených.
    // Proto jdeme jen do `length - pass - 1`.
    for (let current = 0; current < sorted.length - pass - 1; current++) {
      if (sorted[current] > sorted[current + 1]) {
        // Prohodíme sousedy — větší "probublá" doprava
        [sorted[current], sorted[current + 1]] = [sorted[current + 1], sorted[current]];
      }
    }
  }

  return sorted;
}

bubbleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
```

---

### Selection Sort — O(n²)

**Idea:** Pole rozdělíme na dvě části: seřazenou (vlevo) a neseřazenou (vpravo). V každém kole najdeme nejmenší prvek v neseřazené části a přesuneme ho na konec seřazené části.

**Krok za krokem na příkladu `[5, 3, 8, 1, 2]`:**

```
Kolo 0 — seřazená část: [], neseřazená: [5, 3, 8, 1, 2]
  Najdi minimum v neseřazené části → 1 (index 3)
  Prohoď s prvním prvkem neseřazené části (index 0): 5 ↔ 1
  → [1 | 3, 8, 5, 2]   (| označuje hranici seřazené/neseřazené části)

Kolo 1 — seřazená část: [1], neseřazená: [3, 8, 5, 2]
  Najdi minimum → 2 (index 4)
  Prohoď s index 1: 3 ↔ 2
  → [1, 2 | 8, 5, 3]

Kolo 2 — seřazená část: [1, 2], neseřazená: [8, 5, 3]
  Najdi minimum → 3 (index 4)
  Prohoď s index 2: 8 ↔ 3
  → [1, 2, 3 | 5, 8]

... atd.
Výsledek: [1, 2, 3, 5, 8]
```

**Co znamenají proměnné:**
- `sortedBoundary` — index první pozice neseřazené části. Vše vlevo od tohoto indexu je již seřazeno.
- `searchIndex` — prochází neseřazenou část a hledá minimum.
- `minIndex` — index nejmenšího nalezeného prvku v neseřazené části.

```typescript
function selectionSort(numbers: number[]): number[] {
  const sorted = [...numbers];

  for (let sortedBoundary = 0; sortedBoundary < sorted.length; sortedBoundary++) {
    // Předpokládáme, že první prvek neseřazené části je minimum
    let minIndex = sortedBoundary;

    // Projdeme zbytek neseřazené části a hledáme skutečné minimum
    for (let searchIndex = sortedBoundary + 1; searchIndex < sorted.length; searchIndex++) {
      if (sorted[searchIndex] < sorted[minIndex]) {
        minIndex = searchIndex; // našli jsme menší prvek, aktualizujeme
      }
    }

    // Minimum přesuneme na konec seřazené části
    [sorted[sortedBoundary], sorted[minIndex]] = [sorted[minIndex], sorted[sortedBoundary]];
  }

  return sorted;
}

selectionSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
```

---

### Merge Sort — O(n log n)

**Idea:** Rozděl a panuj. Pole rozpůlíme na dvě části, každou část rekurzivně seřadíme a pak dvě seřazené části sloučíme dohromady. Slučování dvou seřazených polí je snadné — stačí porovnat první prvky obou polí a vzít menší.

**Krok za krokem na příkladu `[5, 3, 8, 1, 2]`:**

```
Rozdělování (dolů):
  [5, 3, 8, 1, 2]
  ├── [5, 3]           ├── [8, 1, 2]
  │   ├── [5]          │   ├── [8]
  │   └── [3]          │   └── [1, 2]
  │                    │       ├── [1]
  │                    │       └── [2]

Slučování (zpět nahoru):
  [5] + [3]   → porovnej 5 vs 3 → vezmi 3, pak 5  → [3, 5]
  [1] + [2]   → porovnej 1 vs 2 → vezmi 1, pak 2  → [1, 2]
  [8] + [1,2] → porovnej 8 vs 1 → vezmi 1
              → porovnej 8 vs 2 → vezmi 2
              → zbyde [8]        →              → [1, 2, 8]
  [3,5] + [1,2,8] → 3 vs 1 → 1
                  → 3 vs 2 → 2
                  → 3 vs 8 → 3
                  → 5 vs 8 → 5
                  → zbyde [8]   →              → [1, 2, 3, 5, 8]
```

**Co znamenají proměnné:**
- `midIndex` — střed pole, podle kterého dělíme na levou a pravou polovinu.
- `leftHalf` / `rightHalf` — dvě rekurzivně seřazené poloviny čekající na sloučení.
- `leftIndex` / `rightIndex` — ukazují na aktuální prvek v levé/pravé polovině při slučování. Porovnáváme `leftHalf[leftIndex]` vs `rightHalf[rightIndex]` a menší přidáme do výsledku.

```typescript
function mergeSort(numbers: number[]): number[] {
  // Pole s 0 nebo 1 prvkem je vždy seřazené — to je základní případ rekurze
  if (numbers.length <= 1) return numbers;

  const midIndex = Math.floor(numbers.length / 2);

  // Rekurzivně seřadíme obě poloviny
  const leftHalf = mergeSort(numbers.slice(0, midIndex));
  const rightHalf = mergeSort(numbers.slice(midIndex));

  // Sloučíme dvě seřazené poloviny do jednoho seřazeného pole
  return mergeSorted(leftHalf, rightHalf);
}

function mergeSorted(leftHalf: number[], rightHalf: number[]): number[] {
  const merged: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // Porovnáváme první nepřidaný prvek z levé a pravé poloviny
  // Menší z nich přidáme do výsledku a posuneme příslušný index
  while (leftIndex < leftHalf.length && rightIndex < rightHalf.length) {
    if (leftHalf[leftIndex] <= rightHalf[rightIndex]) {
      merged.push(leftHalf[leftIndex++]);
    } else {
      merged.push(rightHalf[rightIndex++]);
    }
  }

  // Jedna polovina se vyčerpala — zbytek druhé přidáme celý (je již seřazený)
  return [...merged, ...leftHalf.slice(leftIndex), ...rightHalf.slice(rightIndex)];
}

mergeSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
```

---

### Quick Sort — O(n log n) průměr, O(n²) nejhorší

**Idea:** Vybereme jeden prvek jako "pivot". Pak rozdělíme pole na tři skupiny: prvky menší než pivot, prvky rovné pivotu, prvky větší než pivot. Levou a pravou skupinu rekurzivně seřadíme a spojíme.

**Krok za krokem na příkladu `[5, 3, 8, 1, 2]`:**

```
Pivot = prostřední prvek = 8 (index 2)

  smaller (< 8): [5, 3, 1, 2]
  equal   (= 8): [8]
  greater (> 8): []

Rekurzivně seřadíme smaller: quickSort([5, 3, 1, 2])
  Pivot = 3
  smaller (< 3): [1, 2]
  equal   (= 3): [3]
  greater (> 3): [5]

  Rekurzivně: quickSort([1, 2]) → pivot=1 → [] + [1] + [2] → [1, 2]
  Rekurzivně: quickSort([5])   → [5]

  → [1, 2] + [3] + [5] = [1, 2, 3, 5]

Výsledek: [1, 2, 3, 5] + [8] + [] = [1, 2, 3, 5, 8]
```

**Co znamenají proměnné:**
- `pivot` — referenční hodnota, podle které dělíme pole. Volba pivotu ovlivňuje výkon.
- `smaller` — prvky menší než pivot (půjdou vlevo).
- `equal` — prvky rovné pivotu (jsou již na správném místě).
- `greater` — prvky větší než pivot (půjdou vpravo).

```typescript
function quickSort(numbers: number[]): number[] {
  if (numbers.length <= 1) return numbers;

  // Pivot volíme ze středu — snižuje riziko nejhoršího případu O(n²)
  const pivot = numbers[Math.floor(numbers.length / 2)];

  const smaller = numbers.filter(item => item < pivot);
  const equal   = numbers.filter(item => item === pivot);
  const greater = numbers.filter(item => item > pivot);

  // Rekurzivně seřadíme obě strany a spojíme: menší + pivot + větší
  return [...quickSort(smaller), ...equal, ...quickSort(greater)];
}

quickSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]
```

---

## Vyhledávací algoritmy (Searching)

---

### Linear Search — O(n)

**Idea:** Nejjednodušší možné hledání. Procházíme pole od začátku do konce a každý prvek porovnáme s hledanou hodnotou. Vrátíme index při prvním nalezení.

**Krok za krokem — hledáme `8` v `[5, 3, 8, 1, 2]`:**

```
index 0 → 5 === 8 ? NE
index 1 → 3 === 8 ? NE
index 2 → 8 === 8 ? ANO → vrátíme 2
```

**Kdy použít:** Pole není seřazené, nebo je malé. Pokud je seřazené a velké → použij Binary Search.

```typescript
function linearSearch(numbers: number[], target: number): number {
  for (let index = 0; index < numbers.length; index++) {
    if (numbers[index] === target) return index; // našli jsme, vrátíme pozici
  }
  return -1; // nenašli jsme
}

linearSearch([5, 3, 8, 1, 2], 8); // 2
linearSearch([5, 3, 8, 1, 2], 9); // -1
```

---

### Binary Search — O(log n)

**Idea:** Funguje pouze na **seřazeném** poli. Místo procházení po jednom prvku se vždy podíváme na prostřední prvek. Pokud je menší než hledaná hodnota, hledáme jen v pravé polovině. Pokud větší, hledáme jen v levé. Každým krokem eliminujeme polovinu zbývajících prvků.

**Krok za krokem — hledáme `5` v `[1, 2, 3, 5, 8]`:**

```
lowerBound=0, upperBound=4
  midIndex = (0+4)/2 = 2 → hodnota na indexu 2 = 3
  3 < 5 → hledáme vpravo → lowerBound = midIndex + 1 = 3

lowerBound=3, upperBound=4
  midIndex = (3+4)/2 = 3 → hodnota na indexu 3 = 5
  5 === 5 → NALEZENO! → vrátíme 3
```

**Co znamenají proměnné:**
- `lowerBound` — levá hranice oblasti, kde ještě hledáme.
- `upperBound` — pravá hranice oblasti, kde ještě hledáme.
- `midIndex` — střed aktuální oblasti. Porovnáme hodnotu na tomto indexu s hledanou hodnotou a podle výsledku posuneme `lowerBound` nebo `upperBound`.

```typescript
function binarySearch(sortedNumbers: number[], target: number): number {
  let lowerBound = 0;
  let upperBound = sortedNumbers.length - 1;

  while (lowerBound <= upperBound) {
    const midIndex = Math.floor((lowerBound + upperBound) / 2);
    const midValue = sortedNumbers[midIndex];

    if (midValue === target) return midIndex;       // přesný zásah
    if (midValue < target)   lowerBound = midIndex + 1; // hledej vpravo
    else                     upperBound = midIndex - 1; // hledej vlevo
  }

  return -1; // lowerBound překročil upperBound → prvek neexistuje
}

binarySearch([1, 2, 3, 5, 8], 5); // 3
binarySearch([1, 2, 3, 5, 8], 4); // -1
```

---

## Grafové algoritmy (Graph)

Graf = uzly (nodes) propojené hranami (edges). Reprezentujeme jako adjacency list — každý uzel má seznam svých sousedů.

```
Graf vypadá takto:
    A
   / \
  B   C
 / \   \
D   E   F
```

```typescript
type Graph = Map<string, string[]>;

const graph: Graph = new Map([
  ["A", ["B", "C"]],
  ["B", ["A", "D", "E"]],
  ["C", ["A", "F"]],
  ["D", ["B"]],
  ["E", ["B"]],
  ["F", ["C"]],
]);
```

---

### BFS — Breadth-First Search — O(V + E)

**Idea:** Procházíme graf "do šířky" — nejdřív navštívíme všechny uzly ve vzdálenosti 1 od startu, pak vzdálenosti 2, atd. Používáme **frontu (queue)** — co přidáme dříve, to zpracujeme dříve (FIFO).

**Krok za krokem — start z uzlu A:**

```
Fronta: [A],  Navštíveno: {A}
  Vezmi A z fronty → přidej sousedy B, C
  Fronta: [B, C],  Navštíveno: {A, B, C}

Vezmi B z fronty → sousedé jsou A (navštívený), D, E → přidej D, E
  Fronta: [C, D, E],  Navštíveno: {A, B, C, D, E}

Vezmi C z fronty → sousedé jsou A (navštívený), F → přidej F
  Fronta: [D, E, F],  Navštíveno: {A, B, C, D, E, F}

Vezmi D → sousedé navštívení → fronta: [E, F]
Vezmi E → sousedé navštívení → fronta: [F]
Vezmi F → sousedé navštívení → fronta: []

Pořadí návštěv: A → B → C → D → E → F
```

**Co znamenají proměnné:**
- `queue` — fronta uzlů čekajících na zpracování. Přidáváme vzadu, bereme zepředu.
- `visited` — množina již navštívených uzlů. Bez ní bychom se zacyklili.
- `currentNode` — uzel, který právě zpracováváme (vzali jsme ho z fronty).
- `visitOrder` — výsledné pořadí, ve kterém jsme uzly navštívili.

```typescript
function bfs(graph: Graph, startNode: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [startNode];
  const visitOrder: string[] = [];

  visited.add(startNode);

  while (queue.length > 0) {
    // Vezmeme první uzel z fronty (FIFO — kdo přišel dřív, jde dřív)
    const currentNode = queue.shift()!;
    visitOrder.push(currentNode);

    // Přidáme všechny nenavštívené sousedy do fronty
    for (const neighbor of graph.get(currentNode) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);   // označíme hned při přidání, ne při zpracování
        queue.push(neighbor);    // zpracujeme ho v budoucím kole
      }
    }
  }

  return visitOrder;
}

bfs(graph, "A"); // ["A", "B", "C", "D", "E", "F"]
```

---

### DFS — Depth-First Search — O(V + E)

**Idea:** Procházíme graf "do hloubky" — jdeme co nejdál jednou cestou, než se vrátíme a zkusíme jinou. Používáme **rekurzi** (nebo zásobník). Na rozdíl od BFS nemusíme projít nejbližší uzly nejdřív.

**Krok za krokem — start z uzlu A:**

```
traverse(A) → navštív A → sousedé: B, C
  traverse(B) → navštív B → sousedé: A (navštívený), D, E
    traverse(D) → navštív D → sousedé: B (navštívený)
    ← vrátíme se zpět do B
    traverse(E) → navštív E → sousedé: B (navštívený)
    ← vrátíme se zpět do B
  ← vrátíme se zpět do A
  traverse(C) → navštív C → sousedé: A (navštívený), F
    traverse(F) → navštív F → sousedé: C (navštívený)

Pořadí návštěv: A → B → D → E → C → F
```

**Rozdíl oproti BFS:** BFS jde level po levelu (A, pak B+C, pak D+E+F). DFS jde "do hloubky" — dokončí celou větev (A→B→D→E) než se vrátí k druhé větvi (C→F).

```typescript
function dfs(graph: Graph, startNode: string): string[] {
  const visited = new Set<string>();
  const visitOrder: string[] = [];

  function traverse(currentNode: string): void {
    visited.add(currentNode);
    visitOrder.push(currentNode);

    // Pro každého souseda — pokud ještě nebyl navštíven, jdeme do hloubky
    for (const neighbor of graph.get(currentNode) ?? []) {
      if (!visited.has(neighbor)) {
        traverse(neighbor); // rekurzivní volání = jdeme hlouběji
      }
    }
    // Až se rekurze vrátí, pokračujeme dalším sousedem
  }

  traverse(startNode);
  return visitOrder;
}

dfs(graph, "A"); // ["A", "B", "D", "E", "C", "F"]
```

---

## Dynamické programování (Dynamic Programming)

**Idea:** Pokud řešíme problém, který se rozkládá na opakující se podproblémy, uložíme výsledky podproblémů do cache. Příště místo výpočtu jen vyhledáme uložený výsledek.

### Fibonacci — O(n) s memoization vs O(2ⁿ) bez

Fibonacciho číslo na pozici `n` = součet dvou předchozích čísel.
`fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5, fib(6)=8, ...`

**Problém bez cache:**

```
fib(5) volá fib(4) a fib(3)
  fib(4) volá fib(3) a fib(2)   ← fib(3) se počítá znovu!
    fib(3) volá fib(2) a fib(1) ← fib(2) se počítá znovu!
  fib(3) volá fib(2) a fib(1)   ← a znovu!

Pro fib(50) by to byly miliardy zbytečných výpočtů.
```

**Řešení s cache (memoization):**

```
fib(5):
  fib(4) → výpočet → uložíme cache[4] = 3
    fib(3) → výpočet → uložíme cache[3] = 2
  fib(3) → cache[3] existuje → vrátíme 2 ihned, bez výpočtu ✓
```

**Co znamenají proměnné:**
- `position` — která pozice v řadě Fibonacci počítáme.
- `cache` — slovník (Map) kam ukládáme výsledky. Klíč = pozice, hodnota = výsledek. Při opakovaném dotazu na stejnou pozici vrátíme uložený výsledek okamžitě.

```typescript
// Bez memoization — exponenciální O(2ⁿ), pro velká n nepoužitelné
function fibSlow(position: number): number {
  if (position <= 1) return position;
  return fibSlow(position - 1) + fibSlow(position - 2); // fib(3) se počítá vícekrát
}

// S memoization — lineární O(n), každá pozice se vypočítá jen jednou
function fib(position: number, cache: Map<number, number> = new Map()): number {
  if (position <= 1) return position;

  // Pokud jsme tuto pozici již počítali, vrátíme uložený výsledek
  if (cache.has(position)) return cache.get(position)!;

  const result = fib(position - 1, cache) + fib(position - 2, cache);

  // Uložíme výsledek pro případné budoucí použití
  cache.set(position, result);
  return result;
}

fib(10);  // 55
fib(50);  // 12586269025  ← fibSlow(50) by trvalo minuty
```

---

## Kdy použít který algoritmus

| Situace | Algoritmus |
|---------|-----------|
| Seřadit pole, výkon není kritický | `Array.sort()` (built-in, Timsort) |
| Seřadit velké pole vlastním způsobem | Merge Sort nebo Quick Sort |
| Hledat v neseřazeném poli | Linear Search |
| Hledat v seřazeném poli | Binary Search |
| Nejkratší cesta v grafu (nevážený) | BFS |
| Průchod stromem, detekce cyklů | DFS |
| Výpočet s opakujícími se podproblémy | Dynamic Programming (memoization) |
