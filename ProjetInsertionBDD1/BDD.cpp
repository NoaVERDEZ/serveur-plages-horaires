#include "BDD.h"

BDD::BDD(QObject *parent) : QObject(parent)
{
}

bool BDD::connectToDatabase()
{
    db = QSqlDatabase::addDatabase("QMYSQL");
    db.setHostName("192.168.64.104");
    db.setDatabaseName("projet_fin_annee");
    db.setUserName("root");
    db.setPassword("root");

    if (!db.open()) {
        qDebug() << "Erreur connexion BDD :" << db.lastError().text();
        return false;
    }

    qDebug() << "Connexion BDD réussie !";
    return true;
}

bool BDD::insertUser(const QString &nom, const QString &prenom, const QString &id_rfid, bool is_prof, bool acces, bool ban)
{
    QSqlQuery query;
    query.prepare("INSERT INTO Utilisateur (nom, prenom, id_rfid, is_prof, acces, ban) "
                  "VALUES (:nom, :prenom, :id_rfid, :is_prof, :acces, :ban)");

    query.bindValue(":nom", nom);
    query.bindValue(":prenom", prenom);
    query.bindValue(":id_rfid", id_rfid);
    query.bindValue(":is_prof", is_prof);
    query.bindValue(":acces", acces);
    query.bindValue(":ban", ban);

    if (!query.exec()) {
        qDebug() << "Erreur insertion :" << query.lastError().text();
        return false;
    }

    return true;
}


