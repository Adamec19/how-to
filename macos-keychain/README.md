# macOS Keychain — ukládání hesel do terminálu

Jak bezpečně uložit heslo (nebo jiný secret) do macOS Keychain a číst ho v shellu bez toho, abys ho měl natvrdo v `.zshrc`.

---

## Proč to dělat?

Místo:
```bash
export DIRECT_PASSWD="moje_heslo_natvrdo"  # ❌ viditelné v .zshrc
```

Uložíš heslo do Keychain a `.zshrc` ho načítá dynamicky:
```bash
export DIRECT_PASSWD=$(security find-generic-password -a "martin.adamec" -s "DIRECT_PASSWD" -w)  # ✅
```

---

## Uložit heslo do Keychain

```bash
security add-generic-password -a "martin.adamec" -s "DIRECT_PASSWD" -w "moje_heslo"
```

| Flag | Význam |
|------|--------|
| `-a` | account — tvoje uživatelské jméno |
| `-s` | service — název klíče (libovolný identifikátor) |
| `-w` | password — hodnota hesla |

---

## Přepsat existující heslo (po změně hesla)

Pokud záznam už existuje, přidej `-U` flag:

```bash
security add-generic-password -U -a "martin.adamec" -s "DIRECT_PASSWD" -w "nove_heslo"
```

> `.zshrc` **nemusíš měnit** — načítá heslo dynamicky, takže změna v Keychain se projeví automaticky při příštím otevření terminálu.

---

## Přečíst heslo z Keychain

```bash
security find-generic-password -a "martin.adamec" -s "DIRECT_PASSWD" -w
```

---

## Nastavit v `.zshrc`

```bash
export DIRECT_PASSWD=$(security find-generic-password -a "martin.adamec" -s "DIRECT_PASSWD" -w)
```

Po uložení `.zshrc` aplikuj změny:
```bash
source ~/.zshrc
```

---

## Ověřit že proměnná funguje

```bash
echo $DIRECT_PASSWD
```

---

## Smazat záznam z Keychain

```bash
security delete-generic-password -a "martin.adamec" -s "DIRECT_PASSWD"
```
