# Git Flow — praktický cheat sheet

## Každodenní základ

```bash
git status                        # zjistit stav repozitáře
git add .                         # přidat všechny změny
git add src/components/Button.tsx # přidat konkrétní soubor
git commit -m "popis změny"       # commitnout
git push                          # poslat na remote
git pull                          # stáhnout změny z remote
```

---

## Větve (branches)

```bash
git checkout -b nazev-vetve       # vytvořit novou větev a přepnout se
git checkout main                 # přepnout na existující větev
git branch                        # zobrazit všechny větve
git branch -d nazev-vetve         # smazat větev lokálně
git push origin --delete nazev-vetve  # smazat větev na remote
```

---

## Vrácení změn — nejčastější situace

**Ještě jsem necommitoval, chci vrátit změny v souboru:**
```bash
git restore src/components/Button.tsx
```

**Chci zahodit VŠECHNY necommitované změny:**
```bash
git restore .
```

**Omylem jsem přidal soubor do stage (`git add`), chci ho vyndat:**
```bash
git restore --staged src/components/Button.tsx
```

**Chci vrátit poslední commit ale zachovat změny v souborech:**
```bash
git reset --soft HEAD~1
```

**Chci úplně zahodit poslední commit i se změnami:**
```bash
git reset --hard HEAD~1
```
> ⚠️ POZOR — toto nelze vrátit (pokud jsi nepushnul)

**Commitnul jsem na špatnou větev:**
```bash
git log --oneline                   # zjisti hash commitu
git checkout spravna-vetev
git cherry-pick abc1234             # přenese commit na správnou větev
git checkout spatna-vetev
git reset --hard HEAD~1             # odeber z původní větve
```

---

## Merge

```bash
git checkout main
git merge nazev-vetve               # mergovat větev do aktuální
```

Při konfliktu — po ručním vyřešení souborů:
```bash
git add .
git commit
```

---

## Stash — odložení rozdělaných změn

```bash
git stash           # odložit aktuální změny stranou
git stash pop       # vrátit odložené změny zpět
git stash list      # zobrazit co máš ve stashi
```

---

## Historie a přehled

```bash
git log --oneline           # přehledná historie commitů
git show abc1234            # zobrazit změny v konkrétním commitu
git diff                    # co se změnilo (před commitem)
git diff --staged           # co je ve stage
```

---

## Oprava posledního commitu

```bash
# Změnit zprávu posledního commitu (ještě nepushnutého)
git commit --amend -m "opravená zpráva"

# Přidat zapomenutý soubor do posledního commitu
git add zapomenutý-soubor.txt
git commit --amend --no-edit
```

---

## Sync s remote

```bash
git pull                            # stáhnout změny a mergovat
git fetch                           # stáhnout bez merge
git diff main origin/main           # rozdíl mezi lokální a remote větví
```

**Přepsat lokální větev tím co je na remote (když je vše rozbitý):**
```bash
git fetch origin
git reset --hard origin/main
```
> ⚠️ POZOR — zahodí všechny lokální změny
