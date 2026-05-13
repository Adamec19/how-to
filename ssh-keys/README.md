# SSH Keys — generování a správa klíčů

## K čemu to je?

SSH klíče slouží k bezpečnému přihlašování na GitHub, vzdálené servery nebo jiné služby — bez zadávání hesla.

Funguje to na principu páru klíčů:
- **private key** → zůstane na tvém počítači (**NIKDY nesdílet!**)
- **public key** → nahraješ na GitHub / server

---

## Vygenerování nového klíče

```bash
ssh-keygen -t ed25519 -C "tvuj@email.cz"
```

- `-t ed25519` = moderní typ klíče (doporučený)
- `-C` = komentář / label (obvykle email)

Po spuštění tě to zeptá:
1. Kam uložit klíč → stiskni Enter (default: `~/.ssh/id_ed25519`)
2. Passphrase → můžeš nechat prázdné (Enter) nebo zadat heslo

**Vytvoří dva soubory:**
```
~/.ssh/id_ed25519        ← private key (NIKDY nesdílet)
~/.ssh/id_ed25519.pub    ← public key  (tento nahraješ kamkoliv)
```

---

## Přidat klíč na GitHub

```bash
# 1. Zkopíruj public key do schránky
pbcopy < ~/.ssh/id_ed25519.pub
```

2. Jdi na GitHub → **Settings → SSH and GPG keys → New SSH key**
3. Vlož klíč a ulož

```bash
# 4. Otestuj připojení
ssh -T git@github.com
# → mělo by napsat: "Hi Adamec19! You've successfully authenticated..."
```

---

## Více účtů na GitHubu (např. work + personal)

```bash
# Vygeneruj druhý klíč s jiným názvem
ssh-keygen -t ed25519 -C "work@firma.cz" -f ~/.ssh/id_ed25519_work
```

Vytvoř nebo uprav soubor `~/.ssh/config`:
```
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
```

Při klonování work repozitáře použiješ alias:
```bash
git clone git@github-work:firma/repozitar.git
```

---

## Přidat klíč na vzdálený server

```bash
ssh-copy-id uzivatel@ip-serveru

# nebo ručně
cat ~/.ssh/id_ed25519.pub | ssh uzivatel@ip-serveru \
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# poté se přihlásíš bez hesla
ssh uzivatel@ip-serveru
```

---

## Zobrazit existující klíče

```bash
ls -la ~/.ssh/                     # výpis všech klíčů
cat ~/.ssh/id_ed25519.pub          # zobrazit public key pro kopírování
```

---

## Přidat klíč do SSH agenta

```bash
ssh-add ~/.ssh/id_ed25519          # přidat klíč
ssh-add -l                         # zobrazit klíče v agentovi
```

---

## Časté situace

**Git stále žádá heslo i po nastavení SSH:**
```bash
git remote -v   # zkontroluj že remote používá SSH a ne HTTPS
```
Pokud vidíš `https://`, přepni na SSH:
```bash
git remote set-url origin git@github.com:Adamec19/repozitar.git
```

**Zapomněl jsem jestli mám klíč na GitHubu:**
```bash
ssh -T git@github.com
# pokud vypíše tvé jméno, klíč je nastavený
```

**Permission denied při SSH připojení:**
```bash
ssh -v uzivatel@server   # verbose mode ukáže kde se to láme
```
