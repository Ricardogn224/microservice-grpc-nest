# Code final
Le code final se trouve sur la branche rdv_api

# Acteurs du projet

Jerrinald, Ricardo, Fassory, Karim

# Project Title

L'application a pour objectif de gérer des rendez-vous entre utilisateur

## Lancer la DB

docker compose up -d mariadb

lancer npx prisma migrate dev dans chacune des API

## Nos APIs

Nous avons 3 API fonctionnels : user-api, rdv-api, lieu-api

rdv-api permet à un utilisateur de demander un rendez-vous à un autre utilisateur de l'application

lieu-api permet de créer un lieu à réserver un lieu pour le rendez-vous. On a comme modalité de rencontre soit le présentiel soit le distanciel(format dans la table lieu), l'établissement ou la plateforme selon que c'est en présentiel ou distanciel, la salle ou le lien internet selon présentiel ou distanciel

## Lancer les 3 APIs en même temps

install pm2 : npm install -g pm2

Pour lancer les 3 APis, il faut lancer à la racine du projet de nestJs cette commande : pm2 start pm2.config.nestJs

## Lancer le front

Pour lancer le front, exécuter cette commande à la racine du dossier front(prise-rdv-front) : python3 app.py
