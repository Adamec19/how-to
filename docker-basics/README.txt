==============================================
  DOCKER BASICS — praktický cheat sheet
==============================================

KONTEJNERY — základní přehled
------------------------------
Zobrazit běžící kontejnery:
  docker ps

Zobrazit všechny kontejnery (i zastavené):
  docker ps -a

Spustit kontejner:
  docker start nazev-kontejneru

Zastavit kontejner:
  docker stop nazev-kontejneru

Restartovat kontejner:
  docker restart nazev-kontejneru

Smazat kontejner (musí být zastavený):
  docker rm nazev-kontejneru


LOGY
----
Zobrazit logy kontejneru:
  docker logs nazev-kontejneru

Sledovat logy živě (jako tail -f):
  docker logs -f nazev-kontejneru

Zobrazit posledních 50 řádků:
  docker logs --tail 50 nazev-kontejneru


EXEC — dostat se dovnitř kontejneru
-------------------------------------
Otevřít bash shell uvnitř kontejneru:
  docker exec -it nazev-kontejneru bash

Otevřít sh (když bash není k dispozici):
  docker exec -it nazev-kontejneru sh

Spustit jednorázový příkaz uvnitř kontejneru:
  docker exec -i nazev-kontejneru psql -U postgres -d moje_db -c "\dt"

  ← takhle funguje i restore_strapi.py script!


KOPÍROVÁNÍ SOUBORŮ
------------------
Zkopírovat soubor Z počítače DO kontejneru:
  docker cp /lokalni/cesta/soubor.sql nazev-kontejneru:/tmp/soubor.sql

Zkopírovat soubor Z kontejneru NA počítač:
  docker cp nazev-kontejneru:/tmp/soubor.sql /lokalni/cesta/soubor.sql


IMAGES
------
Zobrazit stažené image:
  docker images

Smazat image:
  docker rmi nazev-image

Stáhnout image z Docker Hub:
  docker pull postgres:15


DOCKER COMPOSE — spouštění více kontejnerů najednou
-----------------------------------------------------
Spustit všechny služby (na pozadí):
  docker compose up -d

Zastavit všechny služby:
  docker compose down

Zastavit a smazat volumes (POZOR — smaže data v DB!):
  docker compose down -v

Zobrazit logy všech služeb:
  docker compose logs -f

Zobrazit logy konkrétní služby:
  docker compose logs -f postgres

Restartovat konkrétní službu:
  docker compose restart postgres

Spustit příkaz uvnitř služby:
  docker compose exec postgres psql -U postgres


UŽITEČNÉ — čištění
-------------------
Smazat všechny zastavené kontejnery:
  docker container prune

Smazat nepotřebné image:
  docker image prune

Smazat vše najednou (kontejnery, image, cache):
  docker system prune
  ⚠️  POZOR — nevratná operace, jen pro případ že ti dochází místo


ČASTÉ SITUACE
-------------

"Kontejner nejede, chci zjistit proč":
  docker logs nazev-kontejneru

"Potřebuju se dostat do databáze v kontejneru":
  docker exec -it postgres_strapi psql -U postgres

"Kontejner se nespustí protože port je obsazený":
  docker ps                          <- zjisti co běží
  docker stop kontejner-co-blokuje   <- zastav ho

"Chci vidět všechny porty kontejneru":
  docker ps --format "table {{.Names}}\t{{.Ports}}"

==============================================
