const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3003;

app.use(cors({
    origin: 'http://192.168.64.104',  // adapte selon ton frontend
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: '192.168.64.104',
    user: 'site',
    password: 'site',
    database: 'projet_fin_annee'
});

db.connect(err => {
    if (err) {
        console.error('❌ Erreur de connexion à la base de données:', err);
        process.exit(1);
    }
    console.log('✅ Connecté à la base de données MySQL');
});

const config = {
    jwtKey: 'VOTRE_CLE_JWT_SECRETE'
};

// Route login (à garder si tu en as besoin)
app.post('/login', (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ message: "Le nom d'utilisateur et le mot de passe sont requis." });
    }

    const sql = 'SELECT * FROM user WHERE user = ?';
    db.query(sql, [user], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const token = jwt.sign({ user: results[0].user }, config.jwtKey, { expiresIn: '12h' });

        res.cookie('userToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 12 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: 'Connexion réussie', token });
    });
});

// Route sauvegarde emploi du temps
app.post('/save-schedule', (req, res) => {
    const schedule = req.body;

    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const heures = [
        "08:00", "08:55", "09:50", "10:10", "11:05", "12:00",
        "12:50", "13:45", "14:40", "15:35", "15:55", "16:50", "17:45"
    ];

    // Construction des promesses pour chaque mise à jour
    const queries = Object.entries(schedule).map(([key, value]) => {
        const [row, col] = key.split("-").map(Number);
        const heure = heures[row];
        const jour = jours[col];  // Attention ici : dans ton tableau, la colonne 0 = Lundi, donc pas -1

        if (!heure || !jour) return Promise.resolve(); // Ignore si hors tableau

        return new Promise((resolve, reject) => {
            const status = value === "Cours" ? 1 : 0;
            const sql = "UPDATE PlagesHoraires SET cours = ? WHERE jour = ? AND heure = ?";
            db.query(sql, [status, jour, heure], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });

    Promise.all(queries)
        .then(() => res.status(200).json({ message: "Sauvegarde réussie." }))
        .catch(error => {
            console.error("❌ Erreur MySQL :", error);
            res.status(500).json({ message: "Erreur de sauvegarde côté serveur." });
        });
});

// Déconnexion (optionnel)
app.post('/logout', (req, res) => {
    res.clearCookie('userToken');
    res.status(200).json({ message: 'Déconnecté' });
});

app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://192.168.64.104:${port}`);
});
// COMMIT