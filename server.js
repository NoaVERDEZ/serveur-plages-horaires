// Importation des modules nécessaires
const express = require('express');//Permet de créer facilement un serveur web.
const cors = require('cors'); // Utilisé pour gérer les permissions d'accès entre différentes origines (utile pour les API front-end/back-end).
const jwt = require("jsonwebtoken") //Permet de générer et de vérifier des tokens JWT pour l'authentification des utilisateurs.
const bcrypt = require("bcrypt"); //Sert à chiffrer les mots de passe avant de les stocker dans une base de données.
// Initialisation de l'application Express
const app = express();
const port = 3005;
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
//langlace
// Middleware pour permettre les requêtes CORS
app.use(cors());


// Middleware pour parser les données JSON
app.use(express.json());


// Configuration de la base de données
const db = mysql.createConnection({
  host: '192.168.64.104', // Adresse du serveur MySQL (ou IP)
  user: 'site', // Nom d'utilisateur MySQL
  password: 'site', // Mot de passe MySQL (laisser vide si pas de mot de passe)
  database: 'projet_fin_annee' // Nom de la base de données
});


// Connexion à la base de données
db.connect((err) => {
  if (err) {
      console.error('Erreur de connexion à la base de données :', err);
      return;
  }
  console.log('Connecté à la base de données MySQL');
});






// Plages horaires en mémoire (en mode tableau pour simplification)
let horaires = [
  { id: 1, start: "08:00", end: "12:00", date: "2025-03-19" },
  { id: 2, start: "13:00", end: "17:00", date: "2025-03-19" }
];


// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Serveur Node.js opérationnel !');
});


// Route 1 : Ajouter une plage horaire (POST)
app.post('/horaires', (req, res) => {
  const { start, end, date } = req.body;
 
  // Validation des données reçues
  if (!start || !end || !date) {
    return res.status(400).json({ error: 'Données manquantes' });
  }


  // Création de la nouvelle plage horaire
  const newHoraires = {
    id: horaires.length + 1,  // ID auto-incrémenté
    start,
    end,
    date
  };


  horaires.push(newHoraires);  // Ajout de la plage horaire au tableau
  res.status(201).json(newHoraires);  // Réponse avec les données ajoutées
});


// Route 2 : Lire toutes les plages horaires (GET)
app.get('/horaires', (req, res) => {
  res.status(200).json(horaires);  // Renvoie toutes les plages horaires
});


// Route 3 : Lire une plage horaire spécifique (GET avec ID)
app.get('/horaires/:id', (req, res) => {
  const { id } = req.params;  // Récupère l'ID de la plage horaire
  const plage = horaires.find(h => h.id === parseInt(id));  // Recherche dans le tableau


  if (!plage) {
    return res.status(404).json({ error: 'Plage horaire non trouvée' });
  }


  res.status(200).json(plage);  // Renvoie la plage horaire trouvée
});


// Route 4 : Mettre à jour une plage horaire (PUT)
app.put('/horaires/:id', (req, res) => {
  const { id } = req.params;  // Récupère l'ID de la plage horaire
  const { start, end, date } = req.body;  // Récupère les nouvelles données


  const plageIndex = horaires.findIndex(h => h.id === parseInt(id));  // Recherche de l'index


  if (plageIndex === -1) {
    return res.status(404).json({ error: 'Plage horaire non trouvée' });
  }


  // Mise à jour des données
  horaires[plageIndex] = { id: parseInt(id), start, end, date };
  res.status(200).json(horaires[plageIndex]);  // Renvoie la plage horaire mise à jour
});


// Route 5 : Supprimer une plage horaire (DELETE)
app.delete('/horaires/:id', (req, res) => {
  const { id } = req.params;  // Récupère l'ID de la plage horaire
  const plageIndex = horaires.findIndex(h => h.id === parseInt(id));  // Recherche de l'index


  if (plageIndex === -1) {
    return res.status(404).json({ error: 'Plage horaire non trouvée' });
  }


  horaires.splice(plageIndex, 1);  // Suppression de la plage horaire
  res.status(204).send();  // Renvoie un statut "No Content" après la suppression
});


app.post('/login', (req, res) => {
  const {username, password} = req.body;
 
  let errorMessage = '';
 
  if(!username) errorMessage += "Le nom d'utilisateur est manquant pour la connexion. ";
  if(!password) errorMessage += "Le mot de passe est manquant pour la connexion. ";


 
  if (errorMessage !== '') return res.status(400).json({ message: errorMessage });
 
  const sqlLogin = 'SELECT password FROM users WHERE username = ?';
 
connection.query(sqlLogin, [username], (err, results) => {
      if(err) {
          console.error("Erreur SQL lors de la requête sqlLogin\n erreur :\n", err);
          return res.status(500).json({message : "Erreur lors de la connexion"});
      }
     
      if(results.length == 0) return res.status(401).json({ message: "Aucun compte trouvé avec ce nom d'utilisateur"});
     
      const isPasswordValid = bcrypt.compareSync(password, results[0].password);
     
      if(!isPasswordValid) {
          return res.status(401).json({ message : "Mot de passe invalide" })    
      }
     
      let token = jwt.sign({ username }, config.jwtKey);
      res.cookie('userToken', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          maxAge: 43200000
      });
      return res.status(200).json({ message: 'Connexion réussie' });
  })
})


app.listen(port, () => {
    console.log("Serveur démarré sur http://localhost:3005");
});
