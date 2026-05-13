# cURL API — testování API z terminálu

## K čemu to je?

`curl` ti umožní otestovat API endpoint přímo z terminálu bez Postmana nebo jiného nástroje.

Hodí se když:
- chceš rychle ověřit že endpoint funguje
- debuguješ response bez zapnutého prohlížeče
- testuješ autentizaci nebo hlavičky

---

## GET request

```bash
curl https://api.example.com/users

# s hezky formátovaným výstupem
curl https://api.example.com/users | python3 -m json.tool

# zobrazit i hlavičky response
curl -i https://api.example.com/users

# zobrazit jen hlavičky (bez body)
curl -I https://api.example.com/users
```

---

## POST request

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Martin", "email": "martin@example.com"}'

# poslat data ze souboru
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @data.json
```

---

## PUT / PATCH / DELETE

```bash
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Martin Updated"}'

curl -X PATCH https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Martin Patch"}'

curl -X DELETE https://api.example.com/users/123
```

---

## Autentizace

```bash
# Bearer token (nejčastější — JWT, API klíče)
curl https://api.example.com/users \
  -H "Authorization: Bearer tvuj-token-zde"

# Basic auth
curl https://api.example.com/users \
  -u username:password

# API klíč v hlavičce
curl https://api.example.com/users \
  -H "X-API-Key: tvuj-api-klic"

# API klíč jako query parameter
curl "https://api.example.com/users?api_key=tvuj-api-klic"
```

---

## Strapi — konkrétní příklad

```bash
# Získat všechny stránky
curl http://localhost:1337/api/pages \
  -H "Authorization: Bearer tvuj-strapi-token"

# Vytvořit nový záznam
curl -X POST http://localhost:1337/api/pages \
  -H "Authorization: Bearer tvuj-strapi-token" \
  -H "Content-Type: application/json" \
  -d '{"data": {"title": "Nová stránka", "slug": "nova-stranka"}}'
```

---

## Užitečné flagy

| Flag | Popis |
|---|---|
| `-v` | verbose — zobrazí celou komunikaci |
| `-s` | silent — skryje progress bar |
| `-o soubor.json` | uloží response do souboru |
| `-L` | následuje redirecty (301, 302) |
| `-k` | ignoruje SSL chyby (jen pro lokální vývoj!) |

---

## Časté situace

**Uložit response do souboru:**
```bash
curl https://api.example.com/users -o response.json
```

**SSL chyba na localhostu:**
```bash
curl -k https://localhost:3000/api/users
```

**Chci vidět jen HTTP status code:**
```bash
curl -o /dev/null -s -w "%{http_code}" https://api.example.com/users
# vypíše jen číslo, např. 200 nebo 404
```
