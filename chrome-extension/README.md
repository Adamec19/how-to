# chrome-extension — Chrome Extension s deklarativními pravidly

Jak vytvořit jednoduchou Chrome Extension (Manifest V3), která automaticky modifikuje chování prohlížeče. V tomto případě příklad přesměrovává SharePoint na Google pomocí deklarativních síťových pravidel.

---

## Co je v příkladu

Složka `bypass-sharepoint/` obsahuje hotový extension "Bypass SharePoint" — můžeš ho použít jako šablonu.

```
bypass-sharepoint/
├── manifest.json       # Konfigurační soubor extension
├── rules.json          # Síťová pravidla (co extension dělá)
└── _metadata/          # Metadata (vygenerované Chrome)
```

---

## Jak to funguje

### manifest.json — Konfigurační soubor

```json
{
  "manifest_version": 3,
  "name": "Bypass SharePoint",
  "version": "1.0",
  "permissions": ["declarativeNetRequestWithHostAccess"],
  "host_permissions": ["https://directpojistovnaas.sharepoint.com/*"],
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "rules.json"
      }
    ]
  }
}
```

**Jednotlivé klíče:**

| Klíč | Hodnota | Vysvětlení |
|------|---------|-----------|
| `manifest_version` | `3` | Nový standard (V2 je deprecated) |
| `name` | `Bypass SharePoint` | Název extension |
| `version` | `1.0` | Verze |
| `permissions` | `["declarativeNetRequestWithHostAccess"]` | Povolujeme síťová pravidla |
| `host_permissions` | `["https://...sharepoint.com/*"]` | Na které domény se vztahují pravidla |
| `declarative_net_request.rule_resources` | `[...]` | Odkaz na soubor s pravidly |

### rules.json — Síťová pravidla

```json
[
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "redirect",
      "redirect": {
        "url": "https://google.com"
      }
    },
    "condition": {
      "regexFilter": "^https://directpojistovnaas\\.sharepoint\\.com/sites/Directintranet/?([?#].*)?$",
      "resourceTypes": ["main_frame"]
    }
  }
]
```

**Struktura pravidla:**

- `id` — jedinečný identifikátor
- `priority` — priorita (nižší číslo = vyšší priorita)
- `action` — co se má stát (redirect, block, modifyHeaders, ...)
- `condition` — kdy se pravidlo aplikuje (regexFilter, resourceTypes, ...)

**Co dělá tento příklad:**
- Když se pokusíš navštívit `https://directpojistovnaas.sharepoint.com/sites/Directintranet/`
- Extension to přesměruje na `https://google.com`

---

## Proč Manifest V3 a deklarativní pravidla?

### Bezpečnost
- V2 je deprecated — Chrome ho už nepodporuje
- V3 je bezpečnější, omezuje co extension může dělat

### Deklarativní vs imperativní
- **Deklarativní** (V3): Pravidla v JSONu — jednoduchá, bezpečná, výkonná
- **Imperativní** (V2): JavaScript kód — flexibilnější, ale nebezpečnější

---

## Jak to nainstalovat

1. Otevři Chrome na `chrome://extensions/`
2. Zapni **Developer mode** (vpravo nahoře)
3. Klikni **Load unpacked**
4. Vyber `bypass-sharepoint` folder
5. Extension se nainstaluje a bude aktivní

**Testování:** Pokud se pokusíš navštívit SharePoint URL, měl by tě to přesměrovat.

---

## Jak si to upravit

### Změnit URL, na kterou se redirectuje

Otevři `rules.json` a změň:
```json
"redirect": {
  "url": "https://nova-adresa.com"
}
```

### Změnit, kterou doménu redirektovat

V `rules.json` změň `regexFilter`:
```json
"condition": {
  "regexFilter": "^https://nova-domena\\.com/.*",
  "resourceTypes": ["main_frame"]
}
```

### Povolení pro Chrome

V `manifest.json` změň `host_permissions`:
```json
"host_permissions": ["https://nova-domena.com/*"]
```

### Reload extension

Když uložíš změny, jdi na `chrome://extensions/` a klikni **Reload** na extension.

---

## Příklady pravidel

### Blokovat stránku
```json
{
  "id": 2,
  "priority": 1,
  "action": {
    "type": "block"
  },
  "condition": {
    "regexFilter": "^https://blokovana-stranka\\.com/.*"
  }
}
```

### Modifikovat User-Agent
```json
{
  "id": 3,
  "priority": 1,
  "action": {
    "type": "modifyHeaders",
    "requestHeaders": [
      {
        "header": "User-Agent",
        "operation": "set",
        "value": "CustomBot/1.0"
      }
    ]
  },
  "condition": {
    "regexFilter": "^https://api\\.example\\.com/.*"
  }
}
```

### Přidat hlavičku
```json
{
  "id": 4,
  "priority": 1,
  "action": {
    "type": "modifyHeaders",
    "requestHeaders": [
      {
        "header": "X-Custom-Header",
        "operation": "set",
        "value": "my-value"
      }
    ]
  },
  "condition": {
    "regexFilter": "^https://example\\.com/.*"
  }
}
```

---

## Regex reference

| Pattern | Popis |
|---------|-------|
| `^https://example\\.com/.*` | Všechny URL na `example.com` |
| `^https://.*\\.sharepoint\\.com/.*` | Všechny SharePoint subdomény |
| `\\.pdf$` | Pouze PDF soubory |
| `^https://api\\..*` | Všechny API subdomény |

> ⚠️ V regexFiltre se `.` zapisuje jako `\\.` (escaped)

---

## Užitečné zdroje

- [Chrome Extensions Dev Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migrační průvodce](https://developer.chrome.com/docs/extensions/mv3/mv2-sunset/)
- [Declarative Net Request API](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/)
- [Chrome Extension Examples](https://github.com/GoogleChrome/chrome-extensions-samples)
