==============================================
  SSH KEYS — generování a správa klíčů
==============================================

K ČEMU TO JE?
-------------
SSH klíče slouží k bezpečnému přihlašování na GitHub,
vzdálené servery nebo jiné služby — bez zadávání hesla.

Funguje to na principu páru klíčů:
  - private key  → zůstane na tvém počítači (NIKDY nesdílet!)
  - public key   → nahraješ na GitHub / server


VYGENEROVÁNÍ NOVÉHO KLÍČE
--------------------------
  ssh-keygen -t ed25519 -C "tvuj@email.cz"

  ← -t ed25519  = moderní typ klíče (doporučený)
  ← -C          = komentář / label (obvykle email)

Po spuštění tě to zeptá:
  1. Kam uložit klíč → stiskni Enter (default: ~/.ssh/id_ed25519)
  2. Passphrase      → můžeš nechat prázdné (Enter) nebo zadat heslo

Vytvoří dva soubory:
  ~/.ssh/id_ed25519        ← private key (NIKDY nesdílet)
  ~/.ssh/id_ed25519.pub    ← public key  (tento nahraješ kamkoliv)


PŘIDAT KLÍČ NA GITHUB
----------------------
  1. Zkopíruj public key do schránky:
       pbcopy < ~/.ssh/id_ed25519.pub

  2. Jdi na GitHub → Settings → SSH and GPG keys → New SSH key

  3. Vlož klíč a ulož

  4. Otestuj připojení:
       ssh -T git@github.com
       ← mělo by napsat: "Hi martin! You've successfully authenticated..."


VÍCE ÚČTŮ NA GITHUBU (např. work + personal)
---------------------------------------------
Vygeneruj druhý klíč s jiným názvem:
  ssh-keygen -t ed25519 -C "work@firma.cz" -f ~/.ssh/id_ed25519_work

Vytvoř nebo uprav soubor ~/.ssh/config:
  Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work

  Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

Pak při klonování work repozitáře použiješ:
  git clone git@github-work:firma/repozitar.git
  (místo github.com použiješ alias github-work)


PŘIDAT KLÍČ NA VZDÁLENÝ SERVER
--------------------------------
  ssh-copy-id uzivatel@ip-serveru

Nebo ručně:
  cat ~/.ssh/id_ed25519.pub | ssh uzivatel@ip-serveru \
    "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

Poté se přihlásíš bez hesla:
  ssh uzivatel@ip-serveru


ZOBRAZIT EXISTUJÍCÍ KLÍČE
--------------------------
  ls -la ~/.ssh/

Zobrazit obsah public key (pro kopírování):
  cat ~/.ssh/id_ed25519.pub


PŘIDAT KLÍČ DO SSH AGENTA
--------------------------
Aby ses nemusel opakovaně autentizovat při každém použití:

  ssh-add ~/.ssh/id_ed25519

Zobrazit klíče v agentovi:
  ssh-add -l


ČASTÉ SITUACE
-------------

"Git stále žádá heslo i po nastavení SSH":
  Zkontroluj že remote používá SSH a ne HTTPS:
    git remote -v
  Pokud vidíš https://, přepni na SSH:
    git remote set-url origin git@github.com:uzivatel/repozitar.git

"Zapomněl jsem jestli mám klíč na GitHubu":
  ssh -T git@github.com
  ← pokud vypíše tvé jméno, klíč je nastavený

"Permission denied při SSH připojení":
  ssh -v uzivatel@server   ← verbose mode ukáže kde se to láme

==============================================
