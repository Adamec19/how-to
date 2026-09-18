# Testing and Review

## Co testovat

Testuj kontrakt a chování, ne interní implementaci:

- uživatel vidí správný stav;
- callback dostane správná data;
- validace odmítne neplatný vstup;
- loading/error/success stav se správně přepíná;
- dialog otevře správný obsah a zavře se správným způsobem.

## Test naming

```tsx
describe("SaveButton", () => {
  it("disables itself while saving", () => {
    // arrange, act, assert
  });
});
```

Test pojmenuj podle pozorovatelného výsledku, ne podle privátní funkce.

## Review checklist

- Je datový tok čitelný od vstupu po výstup?
- Neobsahuje state hodnotu, kterou lze odvodit?
- Má každý effect cleanup a správné dependencies?
- Je komponenta controlled nebo uncontrolled záměrně?
- Je API response ověřená před použitím?
- Neuniká business logika do generické UI komponenty?
- Je chyba zobrazena nebo předána na správnou hranici?
- Pokrývá test nový behavior contract?
- Neobsahuje změna nesouvisející refactoring?

## Malý testovací vzor

```tsx
it("calls onSave with the edited value", async () => {
  const onSave = vi.fn();
  render(<Editor initialValue="old" onSave={onSave} />);

  await userEvent.clear(screen.getByRole("textbox"));
  await userEvent.type(screen.getByRole("textbox"), "new");
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(onSave).toHaveBeenCalledWith("new");
});
```

Použij test runner a mock API, které odpovídají konkrétnímu projektu. Ukázka výše je záměrně obecná.
