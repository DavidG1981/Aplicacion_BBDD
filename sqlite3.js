const express = require('express');
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const app = express();
exports.app = app;
const db = new sqlite3.Database('mydb.sqlite');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Para servir archivos estáticos como HTML

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS user (name TEXT, age INTEGER, address TEXT)");
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
app.post('/add', (req, res) => {
    const stmt = db.prepare("INSERT INTO user VALUES (?, ?, ?)");
    stmt.run(req.body.name, req.body.age, req.body.address);
    stmt.finalize();
    res.redirect('/');
});
app.get('/users', (req, res) => {
    db.all("SELECT * FROM user", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

const { app } = require('./server');

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

