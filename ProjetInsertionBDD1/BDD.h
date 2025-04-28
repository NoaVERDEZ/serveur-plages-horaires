#ifndef BDD_H
#define BDD_H

#include <QObject>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QSqlError>
#include <QDebug>

class BDD : public QObject
{
    Q_OBJECT

public:
    explicit BDD(QObject *parent = nullptr);
    bool connectToDatabase();
    bool insertUser(const QString &nom, const QString &prenom, const QString &id_rfid, bool is_prof, bool acces, bool ban);

private:
    QSqlDatabase db;
};

#endif // BDD_H
