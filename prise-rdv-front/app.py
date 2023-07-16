import pandas as pd
from flask import Flask, send_file, render_template, request, redirect, session, url_for, flash
from flask_caching import Cache
from flask_session import Session
import os
import grpc
import proto.user_pb2 as user_pb2
import proto.user_pb2_grpc as user_pb2_grpc

import proto.rdv_pb2 as rdv_pb2
import proto.rdv_pb2_grpc as rdv_pb2_grpc
import datetime

import proto.lieu_pb2 as lieu_pb2
import proto.lieu_pb2_grpc as lieu_pb2_grpc


# Créer un canal gRPC pour se connecter à l'API
channel = grpc.insecure_channel('127.0.0.1:7000')
channelRdv = grpc.insecure_channel('127.0.0.1:5000')
channelLieu = grpc.insecure_channel('127.0.0.1:5005')

# Create a client for the RdvCRUD service
clientRdv = rdv_pb2_grpc.RdvCRUDServiceStub(channelRdv)

# Function to get RDVs by user_id


def get_rdv_by_id(rdv_id):
    request = rdv_pb2.GetRequest(id=rdv_id)
    response = clientRdv.Get(request)
    return response.rdv[0] if response.rdv else None


def get_rdvs_by_user_id(user_id):
    request = rdv_pb2.GetRequest(idUser=user_id)
    response = clientRdv.Get(request)
    return response.rdv

# Function to add a new RDV


def add_rdv(name, user_id, rdv_date, rdv_hour, id_lieu, status, description, participant_id):
    request = rdv_pb2.AddRequest(
        name=name,
        idUser=user_id,
        rdv_date=rdv_date,
        rdv_hour=rdv_hour,
        idLieu=id_lieu,
        status=status,
        description=description,
        participantId=participant_id
    )
    response = clientRdv.Add(request)
    return response.rdv

# Function to update an existing RDV


def update_rdv(rdv):
    request = rdv_pb2.UpdateRequest(rdv=rdv)
    response = clientRdv.Update(request)
    return response.rdv

# Function to delete an RDV by ID


def delete_rdv_by_id(rdv_id):
    request = rdv_pb2.DeleteRequest(id=rdv_id)
    response = clientRdv.Delete(request)
    return response.rdv


def update_rdv_status(rdv_id, new_status):
    # Obtenir le RDV à mettre à jour
    rdv = get_rdv_by_id(rdv_id)

    # Mettre à jour le statut du RDV
    rdv.status = new_status
    # je lmets à jour la date de creation du rdv

    rdv1 = [
        {"rdv": {
            "id": rdv_id,
            "status": new_status
        }
        }
    ]
    print(rdv1[0]["rdv"])

    # Appeler la méthode d'update pour sauvegarder les changements
    updated_rdv = update_rdv(rdv1[0]["rdv"])

    return updated_rdv


# Créer un client gRPC pour le service UserCRUD
client = user_pb2_grpc.UserCRUDServiceStub(channel)


def get_all_users():
    # Utilise une requête vide pour récupérer tous les utilisateurs
    request = user_pb2.GetRequest()
    response = client.Get(request)
    return response.user


def get_user(user_id):
    request = user_pb2.GetRequest(id=user_id)
    response = client.Get(request)
    return response.user


def add_user(first_name, last_name, email, password):
    request = user_pb2.AddRequest(
        firstName=first_name,
        lastName=last_name,
        email=email,
        password=password
    )
    response = client.Add(request)
    return response.user


def update_user(user):
    request = user_pb2.UpdateRequest(user=user)
    response = client.Update(request)
    return response.user


def delete_user(user_id):
    request = user_pb2.DeleteRequest(id=user_id)
    response = client.Delete(request)
    return response.user


def check_password(email, password):
    request = user_pb2.CheckPasswordRequest(email=email, password=password)
    response = client.CheckPassword(request)
    return response.status, response.user


def make_admin(user_id, email):
    request = user_pb2.MakeAdminRequest(id=user_id, email=email)
    response = client.MakeAdmin(request)
    return response.user


# Créer un client gRPC pour le service LieuCRUD
clientLieu = lieu_pb2_grpc.LieuCRUDServiceStub(channelLieu)


def get_lieu(lieu_id):
    request = lieu_pb2.GetRequest(id=lieu_id)
    response = clientLieu.Get(request)
    return response.lieu


def add_lieu(format, etablissement_plateforme, salle_lien):
    request = lieu_pb2.AddRequest(
        format=format,
        etablissement_plateforme=etablissement_plateforme,
        salle_lien=salle_lien
    )
    response = clientLieu.Add(request)
    return response.lieu


def update_lieu(lieu):
    request = lieu_pb2.UpdateRequest(lieu=lieu)
    response = clientLieu.Update(request)
    return response.lieu


def delete_lieu(lieu_id):
    request = lieu_pb2.DeleteRequest(id=lieu_id)
    response = clientLieu.Delete(request)
    return response.lieu


def get_all_lieux():
    # Utilise une requête vide pour récupérer tous les lieux
    request = lieu_pb2.GetRequest()
    response = clientLieu.Get(request)
    return response.lieu


# je crée des leiux
lieu1 = add_lieu("Présentiel", "Etablissement", "https://visio.com")
lieu2 = add_lieu("Visio", "Plateforme", "https://visio.com")
lieu3 = add_lieu("Présentiel", "Etablissement", "https://visio.com")
lieu4 = add_lieu("Visio", "Plateforme", "https://visio.com")
lieu5 = add_lieu("Visio", "Etablissement", "https://visio.com")

# je crée des utilisateurs

user2 = user = add_user("Jean", "Dupont", "jeandupont@gmail.coml", "123456")
user3 = user = add_user("Jean", "clade", "jeanclade@gmail.com", "123456")

# je crée des rendez vous

rdv1 = add_rdv("rdv1", "Etablissement", "2021-05-20", "10:00",
               "1", "En attente", "description", "2")
rdv2 = add_rdv("rdv2", "Etablissement", "2021-05-20", "10:00",
               "1", "En attente", "description", "2")
rdv3 = add_rdv("rdv3", "Etablissement", "2021-05-20", "10:00",
               "1", "En attente", "description", "2")


app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False

# Configure the cache type
app.config['CACHE_TYPE'] = 'simple'

# Initialize the cache
cache = Cache(app)


Session(app)


@app.route("/")
def welcome():
    """ return render_template('wait.html') """

    return render_template('index.html')


@app.route('/deconnexion')
def deconnexion():
    session.clear()
    return redirect('/')


@app.route("/inscription", methods=["POST", "GET"])
def inscription():
    if request.method == "POST":
        first_name = request.form.get("nom")
        last_name = request.form.get("prenom")
        email = request.form.get("email")
        password = request.form.get("password")
        password2 = request.form.get("password-confirm")

        if password != password2:
            flash("Les mots de passe ne correspondent pas")
            return render_template('inscription.html')

        user = add_user(first_name, last_name, email, password)
        flash("Nouvel utilisateur ajouté : " +
              user.firstName + " " + user.lastName)
        print("Nouvel utilisateur ajouté :", user)
        # j'initialise la session avec l'utilisateur
        session["user_info"] = user
        return render_template('index.html')
    return render_template('inscription.html')


@app.route("/update_profile")
def update_profile():
    return render_template('update-profile.html')


@app.route("/connexion", methods=["POST", "GET"])
def connexion():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        print("Email :", email)
        print("Password :", password)
        status, user = check_password(email, password)
        print("user :", user.firstName, user.lastName)

        if status == 0:

            session["user_info"] = user
            print(" session connecté :", session["user_info"])
            print("Utilisateur  id :", user.id)
            # je recupere tous les users
            users = get_all_users()

            # on recupère les rdv de l'user connecté
            rdvs = get_rdvs_by_user_id(user.id)
            return redirect(url_for('gestion_rdv'))
        else:
            return render_template('connexion.html')
    return render_template('connexion.html')


@app.route("/gestion-rdv", methods=["POST", "GET"])
def gestion_rdv():

    if request.method == "GET":
        user = get_user("1")

        print("Utilisateur connecté :", user)

        # je recupere tous les users
        users = get_all_users()
        # print("Tous les utilisateurs :", users)

        # on recupère les rdv de l'user connecté
        rdvs = get_rdvs_by_user_id(session.get("user_info"))
        # print("RDV de l'utilisateur connecté :", rdvs)

        # je recupère tout les lieu
        lieux = get_all_lieux()
        print("Tous les lieux :", lieux)

        return render_template('gestion-rdv.html', users=users, user=user, rdvs=rdvs, lieux=lieux)

    elif request.method == "POST":
        # obtenir l' id de l'user connecté en session
        user_id = "1"
        user = get_user(user_id)
        print("Utilisateur connecté :", user_id)
        # j'ajoute un rdv
        name = "rdv"
        rdv_date = str(request.form.get("rdv_date"))
        rdv_hour = str(request.form.get("rdv_hour"))
        lieu_id = str(request.form.get("lieu_id"))
        participant_id = str(request.form.get("participant_id"))
        description = str(request.form.get("description"))
        status = "En attente"
        print("participant_id :", participant_id)
        print("rdv_date :", rdv_date)
        print("rdv_hour :", rdv_hour)
        print("lieu_id :", lieu_id)
        print("user_id :", user_id)
        print("name :", name)
        rdv = add_rdv(name, user_id, rdv_date, rdv_hour, lieu_id,
                      status, description, participant_id)
        print("Nouveau rdv ajouté :", rdv)
        # on recupère les rdv de l'user connecté
        rdvs = get_rdvs_by_user_id(user_id)

        # je recupere tous les users
        users = get_all_users()

        # je recupère tout les lieu
        lieux = get_all_lieux()

        print("Tous les lieux :", lieux)
        return render_template('gestion-rdv.html', users=users, rdvs=rdvs, user=user, lieux=lieux)


@app.route("/list-medecin")
def list_praticien():
    return render_template('medecin-list.html')


@app.route("/add_lieu", methods=["POST", "GET"])
def lieu():
    if request.method == "POST":
        format = request.form.get("format")
        etablissement_plateforme = request.form.get("etablissementPlateforme")
        salle_lien = request.form.get("salleLien")
        print("format :", format)
        print("etablissement_plateforme :", etablissement_plateforme)
        print("salle_lien :", salle_lien)
        lieu = add_lieu(format, etablissement_plateforme, salle_lien)
        print("Nouveau lieu ajouté :", lieu)
        return redirect(url_for('gestion_rdv'))

    return render_template('ajouter-lieu.html')


@app.route("/update_status/<string:rdv_id>/<string:new_status>")
def update_lieu(rdv_id, new_status):
    update_rdv_status(str(rdv_id), new_status)
    return redirect(url_for('gestion_rdv'))


@app.route('/clear_cache')
def clear_cache():
    app.jinja_env.cache = {}
    return 'Cache cleared'


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=9001)
