==============================================
  GIT FLOW — praktický cheat sheet
==============================================

KAŽDODENNÍ ZÁKLAD
-----------------
Zjistit stav repozitáře:
  git status

Přidat změny a commitnout:
  git add .
  git commit -m "popis změny"

Přidat jen konkrétní soubor:
  git add src/components/Button.tsx

Poslat na remote:
  git push

Stáhnout změny z remote:
  git pull


VĚTVE (branches)
----------------
Vytvořit novou větev a přepnout se na ni:
  git checkout -b nazev-vetve

Přepnout se na existující větev:
  git checkout main
  git checkout nazev-vetve

Zobrazit všechny větve:
  git branch

Smazat větev (lokálně):
  git branch -d nazev-vetve

Smazat větev na remote:
  git push origin --delete nazev-vetve


VRÁCENÍ ZMĚN — nejčastější situace
------------------------------------

"Ještě jsem necommitoval, chci vrátit změny v souboru":
  git checkout -- src/components/Button.tsx

"Chci zahodit VŠECHNY necommitované změny":
  git checkout -- .
  nebo novější syntax:
  git restore .

"Omylem jsem přidal soubor do stage (git add), chci ho vyndat":
  git restore --staged src/components/Button.tsx

"Chci vrátit poslední commit ale zachovat změny v souborech":
  git reset --soft HEAD~1

"Chci úplně zahodit poslední commit i se změnami":
  git reset --hard HEAD~1
  ⚠️  POZOR — toto nelze vrátit (pokud jsi nepushnul)

"Commitnul jsem na špatnou větev":
  1. git log --oneline          <- zjisti hash commitu
  2. git checkout spravna-vetev
  3. git cherry-pick abc1234    <- přenese commit na správnou větev
  4. git checkout spatna-vetev
  5. git reset --hard HEAD~1    <- odeber z původní větve


MERGE
-----
Mergovat větev do aktuální:
  git checkout main
  git merge nazev-vetve

Při konfliktu — po ručním vyřešení souborů:
  git add .
  git commit


STASH — odložení rozdělaných změn
-----------------------------------
Odložit aktuální změny stranou (např. potřebuješ rychle přepnout větev):
  git stash

Vrátit odložené změny zpět:
  git stash pop

Zobrazit co máš ve stashi:
  git stash list


HISTORIE A PŘEHLED
------------------
Zobrazit historii commitů (přehledně):
  git log --oneline

Zobrazit změny v konkrétním commitu:
  git show abc1234

Zobrazit co se změnilo (před commitem):
  git diff

Zobrazit co je ve stage:
  git diff --staged


OPRAVA POSLEDNÍHO COMMITU
--------------------------
Změnit zprávu posledního commitu (ještě nepushnutého):
  git commit --amend -m "opravená zpráva"

Přidat zapomenutý soubor do posledního commitu:
  git add zapomenutý-soubor.txt
  git commit --amend --no-edit


SYNC S REMOTE
-------------
Stáhnout změny a mergovat:
  git pull

Stáhnout změny bez merge (jen aktualizovat info):
  git fetch

Zobrazit rozdíl mezi lokální a remote větví:
  git diff main origin/main

Přepsat lokální větev tím co je na remote (když je vše rozbitý):
  git fetch origin
  git reset --hard origin/main
  ⚠️  POZOR — zahodí všechny lokální změny

==============================================
