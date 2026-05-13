==============================================
  CO JE SYMLINK A JAK HO POUŽÍT
==============================================

CO JE SYMLINK?
--------------
Symlink (symbolic link) = zástupce / shortcut.

Znáš ikonku na ploše Windows, která odkazuje na program
někde jinde na disku? Symlink funguje úplně stejně,
jen na úrovni souborového systému v terminálu.

Soubor fyzicky existuje jen na jednom místě (originál),
ale ze jiného místa na něj ukazuje "zkratka" (symlink).

Když originál upravíš → změna se projeví automaticky
přes symlink. Není potřeba nic kopírovat.


JAK VYTVOŘIT SYMLINK?
---------------------
Příkaz:
  ln -s ORIGINÁL ZKRATKA

Čtení příkazu:
  ln  = "link" (vytvoř odkaz)
  -s  = "symbolic" (symbolický, ne fyzická kopie)


MŮJ KONKRÉTNÍ PŘÍKLAD (.claude setup)
--------------------------------------
Chci spouštět script z repozitáře direct-ai-skills
jednoduše ze složky .claude, bez psaní celé cesty.

Originál scriptu žije tady:
  /Users/martin.adamec/work/direct/setup/direct-ai-skills/setup.sh

Vytvořím symlink v .claude:
  ln -s /Users/martin.adamec/work/direct/setup/direct-ai-skills/setup.sh \
        /Users/martin.adamec/.claude/setup.sh

Po tomto příkazu mohu script spustit jednoduše takto:
  bash ~/.claude/setup.sh


DŮLEŽITÉ INFO
-------------
- Příkaz ln -s se provede JEDNOU a symlink tam zůstane natrvalo.
- Kdykoliv chceš script znovu spustit, stačí:  bash ~/.claude/setup.sh
- Symlink přestane fungovat pouze pokud:
    1) Přesunout nebo přejmenovat originální script
    2) Smazat samotný symlink ze složky .claude


JAK ZKONTROLOVAT ŽE SYMLINK EXISTUJE?
--------------------------------------
  ls -la ~/.claude/

Ve výpisu uvidíš řádek jako:
  setup.sh -> /Users/martin.adamec/work/direct/setup/direct-ai-skills/setup.sh
  (šipka -> říká "toto je symlink, ukazuje tam")


JAK SYMLINK SMAZAT?
-------------------
  rm ~/.claude/setup.sh
  (smaže jen symlink, originál v direct-ai-skills zůstane nedotčen)

==============================================
