==============================================
  CURL API — testování API z terminálu
==============================================

K ČEMU TO JE?
-------------
curl ti umožní otestovat API endpoint přímo z terminálu
bez Postmana nebo jiného nástroje.

Hodí se když:
  - chceš rychle ověřit že endpoint funguje
  - debuguješ response bez zapnutého prohlížeče
  - testuje autentizaci nebo hlavičky


ZÁKLADNÍ GET REQUEST
--------------------
  curl https://api.example.com/users

S hezky formátovaným výstupem (přes Python):
  curl https://api.example.com/users | python3 -m json.tool

Zobrazit i hlavičky response:
  curl -i https://api.example.com/users

Zobrazit jen hlavičky (bez body):
  curl -I https://api.example.com/users


POST REQUEST
------------
Poslat JSON data:
  curl -X POST https://api.example.com/users \
    -H "Content-Type: application/json" \
    -d '{"name": "Martin", "email": "martin@example.com"}'

Poslat data z souboru:
  curl -X POST https://api.example.com/users \
    -H "Content-Type: application/json" \
    -d @data.json


PUT / PATCH / DELETE
--------------------
  curl -X PUT https://api.example.com/users/123 \
    -H "Content-Type: application/json" \
    -d '{"name": "Martin Updated"}'

  curl -X PATCH https://api.example.com/users/123 \
    -H "Content-Type: application/json" \
    -d '{"name": "Martin Patch"}'

  curl -X DELETE https://api.example.com/users/123


AUTENTIZACE
-----------
Bearer token (nejčastější — JWT, API klíče):
  curl https://api.example.com/users \
    -H "Authorization: Bearer tvuj-token-zde"

Basic auth (username + password):
  curl https://api.example.com/users \
    -u username:password

API klíč v hlavičce:
  curl https://api.example.com/users \
    -H "X-API-Key: tvuj-api-klic"

API klíč jako query parameter:
  curl "https://api.example.com/users?api_key=tvuj-api-klic"


STRAPI KONKRÉTNÍ PŘÍKLAD
-------------------------
Získat všechny stránky ze Strapi:
  curl http://localhost:1337/api/pages \
    -H "Authorization: Bearer tvuj-strapi-token"

Vytvořit nový záznam:
  curl -X POST http://localhost:1337/api/pages \
    -H "Authorization: Bearer tvuj-strapi-token" \
    -H "Content-Type: application/json" \
    -d '{"data": {"title": "Nová stránka", "slug": "nova-stranka"}}'


UŽITEČNÉ FLAGY
--------------
  -v              verbose — zobrazí celou komunikaci (request + response hlavičky)
  -s              silent — skryje progress bar
  -o soubor.json  uloží response do souboru místo terminálu
  -L              následuje redirecty (301, 302)
  -k              ignoruje SSL chyby (jen pro lokální vývoj!)

Kombinace pro debugging:
  curl -v -s https://api.example.com/users 2>&1 | less


ČASTÉ SITUACE
-------------

"Chci uložit response do souboru":
  curl https://api.example.com/users -o response.json

"Dostávám SSL chybu na localhostu":
  curl -k https://localhost:3000/api/users

"Chci vidět HTTP status code":
  curl -o /dev/null -s -w "%{http_code}" https://api.example.com/users
  ← vypíše jen číslo, např. 200 nebo 404

==============================================
