# Docker Basics — praktický cheat sheet

## Kontejnery — základní přehled

```bash
docker ps                          # zobrazit běžící kontejnery
docker ps -a                       # zobrazit všechny (i zastavené)
docker start nazev-kontejneru      # spustit kontejner
docker stop nazev-kontejneru       # zastavit kontejner
docker restart nazev-kontejneru    # restartovat kontejner
docker rm nazev-kontejneru         # smazat kontejner (musí být zastavený)
```

---

## Logy

```bash
docker logs nazev-kontejneru              # zobrazit logy
docker logs -f nazev-kontejneru           # sledovat logy živě
docker logs --tail 50 nazev-kontejneru    # posledních 50 řádků
```

---

## Exec — dostat se dovnitř kontejneru

```bash
docker exec -it nazev-kontejneru bash    # otevřít bash shell
docker exec -it nazev-kontejneru sh      # sh (když bash není k dispozici)

# jednorázový příkaz uvnitř kontejneru
docker exec -i nazev-kontejneru psql -U postgres -d moje_db -c "\dt"
```

> Takhle funguje i `restore_strapi.py` script!

---

## Kopírování souborů

```bash
# Z počítače DO kontejneru
docker cp /lokalni/cesta/soubor.sql nazev-kontejneru:/tmp/soubor.sql

# Z kontejneru NA počítač
docker cp nazev-kontejneru:/tmp/soubor.sql /lokalni/cesta/soubor.sql
```

---

## Images

```bash
docker images                      # zobrazit stažené image
docker rmi nazev-image             # smazat image
docker pull postgres:15            # stáhnout image z Docker Hub
```

---

## Docker Compose — spouštění více kontejnerů najednou

```bash
docker compose up -d               # spustit všechny služby (na pozadí)
docker compose down                # zastavit všechny služby
docker compose down -v             # zastavit + smazat volumes ⚠️ smaže data v DB!
docker compose logs -f             # logy všech služeb
docker compose logs -f postgres    # logy konkrétní služby
docker compose restart postgres    # restartovat konkrétní službu
docker compose exec postgres psql -U postgres  # příkaz uvnitř služby
```

---

## Čištění

```bash
docker container prune    # smazat všechny zastavené kontejnery
docker image prune        # smazat nepotřebné image
docker system prune       # smazat vše (kontejnery, image, cache)
```
> ⚠️ `system prune` je nevratná operace — jen když dochází místo

---

## Časté situace

**Kontejner nejede, chci zjistit proč:**
```bash
docker logs nazev-kontejneru
```

**Potřebuju se dostat do databáze v kontejneru:**
```bash
docker exec -it postgres_strapi psql -U postgres
```

**Kontejner se nespustí protože port je obsazený:**
```bash
docker ps                              # zjisti co běží
docker stop kontejner-co-blokuje       # zastav ho
```

**Chci vidět všechny porty kontejneru:**
```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```
