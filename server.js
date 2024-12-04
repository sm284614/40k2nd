//TO RUN: nodemon server.js

// server.js
const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 40000;
const userId = 1;

app.use(express.static('public'));

//MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: '40k2ndedition',
    database: '2ndedition'
});

// Connect to the database
db.connect(err => {
    if (err) 
    {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.get('/load_content', (req, res) => 
{
    const page = req.query.page; // Get page type from the query parameter
    let sql;
    switch (page) 
    {
        case 'faction_list':
            sql = 'SELECT faction.name AS faction_name, empire.name AS empire_name, faction.strategy_rating, faction.faction_id FROM faction, empire, faction_empire WHERE faction.source = "Codex" AND faction_empire.empire_id = empire.empire_id AND faction.faction_id = faction_empire.faction_id ORDER BY faction.name ASC';
            break;
        case 'weapon_list':
            sql = 'SELECT name, strength, damage FROM weapon ORDER BY name ASC';
            break;
        case 'model_list':
            sql = 'SELECT model.name AS model_name, M, WS, BS, S, T, W, I, A, Ld FROM model';
            break;
        case 'unit_list':
            sql = 'SELECT unit.unit_id, unit.name AS unit_name, unit.cost AS unit_cost, faction.name AS faction_name, unit_model.cost AS unit_model_cost FROM unit LEFT JOIN faction ON unit.faction_id = faction.faction_id  LEFT JOIN unit_model ON unit.unit_id = unit_model.unit_id AND unit_model.main_model = 1 ORDER BY faction.name, unit.codex_order';
            break;                 
        // Add other cases as needed
        default:
            return res.status(400).send('Invalid page type');
    }
    // Perform query
    db.query(sql, (err, results) => 
    {
        if (err) 
        {
            return res.status(500).send(err);
        }
        res.json(results); // Send results as JSON
    });
});
app.get('/load_army_list', (req, res) => 
{
    const sql = 'SELECT army_id, faction.name AS faction_name, army.name AS army_name, army.points_limit FROM faction, army WHERE faction.faction_id = army.faction_id AND army.user_id = ? ORDER BY date_created DESC';            
    db.query(sql, [userId], (err, results) => 
        {
            if (err) 
            {
                return res.status(500).send(err);
            }
            res.json(results); // Send results as JSON
        });
});

// Start the server
app.listen(PORT, () => 
{
    console.log(`Server running on http://localhost:${PORT}`);
});


