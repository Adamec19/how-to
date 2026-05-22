# CLAUDE.md — how-to repository

This file describes the context and rules for working with the how-to repository.
Claude loads it automatically at the start of every new session.

---

## What is this repository

Personal cheat sheet / wiki by Martin Adamec. A collection of practical guides, commands and workflows for everyday development. Each folder = one topic.

**Disk path:** `/Users/martin.adamec/work/how-to`
**GitHub:** `git@github.com:Adamec19/how-to.git`

---

## Rules for creating and editing

### Language
- Folder and file names: **English**
- Section names in README: **English or mixed**
- Descriptive texts, comments, explanations: **česky nebo mix češtiny s angličtinou**
- Code, commands, variables: **always English**

### Folder structure
Each how-to has its own folder with a `README.md`. If the topic requires a script, it is placed next to the README.

```
how-to/
  <topic-name>/
    README.md
    index.py or other script (if needed)
```

### README format
- Heading: `# folder-name — krátký popis česky`
- Sections separated by `---`
- Code blocks always with language tag (` ```bash `, ` ```python `, etc.)
- Tables for flag / variable overviews
- Warnings via `> ⚠️ POZOR` or `## ⚠️ Pozor` section
- Style: concise, practical, no unnecessary filler

### Root README.md
After adding or renaming a folder, always update the table in `/how-to/README.md`.

---

## Existing folders

| Folder | Description |
|--------|-------------|
| `symlink-shortcut` | Vytvoření symlinkového propojení souborů |
| `restore-db` | Restore PostgreSQL ze zálohy přes Docker |
| `cp-dist-workflow` | Lokální testování npm balíčku kopírováním `dist` do `node_modules` |
| `parse-json` | Python script pro počítání Strapi komponent v JSON exportu |
| `git-flow` | Git cheat sheet — každodenní příkazy, větve, reset, stash |
| `docker-basics` | Docker cheat sheet — kontejnery, compose, čištění |
| `curl-api` | Testování API z terminálu pomocí curl |
| `ssh-keys` | Generování SSH klíčů, GitHub setup, více účtů |
| `direct-dev` | Specifika pro vývoj v Directu (endpointy, soubory, projekty) |
| `macos-keychain` | Ukládání hesel do macOS Keychain — bezpečně bez `.zshrc` |

---

## Technical context (Direct development)

- **Insurance BE endpoint (local):** `http://localhost:8976/restapi-property/services/rest/property/insurance/v6/calculation`
- **FE file for URL change:** project `DIF`, file `src/services/insurance/const.ts`
- **Packages:** `@direct/react-components` (DRC) — builds into `dist/`
- **Stack:** Next.js, yarn, TypeScript, Strapi, Docker, PostgreSQL

---

## How to add a new how-to

1. Create folder: `mkdir /Users/martin.adamec/work/how-to/<name>`
2. Create README: following the format above
3. Add a row to the root `README.md` table

## How to edit an existing how-to

1. Edit the file in the relevant folder
2. If the folder name changes — rename the folder + update root README
