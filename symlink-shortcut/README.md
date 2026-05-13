# Symlink Shortcut

## Co je symlink?

Symlink (symbolic link) = zástupce / shortcut.

Znáš ikonku na ploše Windows, která odkazuje na program někde jinde na disku? Symlink funguje úplně stejně, jen na úrovni souborového systému v terminálu.

Soubor fyzicky existuje jen na jednom místě (originál), ale z jiného místa na něj ukazuje "zkratka" (symlink).
Když originál upravíš → změna se projeví automaticky přes symlink. Není potřeba nic kopírovat.

---

## Jak vytvořit symlink?

```bash
ln -s ORIGINÁL ZKRATKA
```

- `ln` = "link" (vytvoř odkaz)
- `-s` = "symbolic" (symbolický, ne fyzická kopie)

---

## Konkrétní příklad — `.claude` setup

Chci spouštět script z repozitáře `direct-ai-skills` jednoduše ze složky `.claude`, bez psaní celé cesty.

**Originál scriptu žije tady:**
```
/Users/martin.adamec/work/direct/setup/direct-ai-skills/setup.sh
```

**Vytvoř symlink v `.claude`:**
```bash
ln -s /Users/martin.adamec/work/direct/setup/direct-ai-skills/setup.sh \
      /Users/martin.adamec/.claude/setup.sh
```

**Po tomto příkazu spustíš script jednoduše:**
```bash
bash ~/.claude/setup.sh
```

---

## Důležité info

- Příkaz `ln -s` se provede **jednou** a symlink tam zůstane natrvalo
- Kdykoliv chceš script znovu spustit, stačí: `bash ~/.claude/setup.sh`
- Symlink přestane fungovat pouze pokud:
  - Přesunout nebo přejmenovat originální script
  - Smazat samotný symlink ze složky `.claude`

---

## Jak zkontrolovat že symlink existuje?

```bash
ls -la ~/.claude/
```

Ve výpisu uvidíš řádek jako:
```
setup.sh -> /Users/martin.adamec/work/direct/setup/direct-ai-skills/setup.sh
```
Šipka `->` říká "toto je symlink, ukazuje tam".

---

## Jak symlink smazat?

```bash
rm ~/.claude/setup.sh
```

Smaže jen symlink — originál v `direct-ai-skills` zůstane nedotčen.
