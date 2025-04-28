#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    bdd = new BDD(this);

    if (!bdd->connectToDatabase()) {
        qDebug() << "Échec de la connexion à la base de données.";
    }
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_clicked()
{
    QString nom = ui->lineEditNom->text();
    QString prenom = ui->lineEditPrenom->text();
    QString id_rfid = ui->lineEditRFID->text();
    bool is_prof = ui->checkBoxIsProf->isChecked();
    bool acces = ui->checkBoxAcces->isChecked();
    bool ban = ui->checkBoxBan->isChecked();

    if (!bdd->insertUser(nom, prenom, id_rfid, is_prof, acces, ban)) {
        qDebug() << "Erreur lors de l'insertion utilisateur.";
    }
}
