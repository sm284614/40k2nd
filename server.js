//TO RUN: nodemon server.js

// server.js
const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 40000;

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


// Define a route to fetch all rows from the 'faction' table
app.get('/faction_list', (req, res) => 
{
    db.query('SELECT faction.name AS faction_name, empire.name AS empire_name, faction.strategy_rating, faction.faction_id FROM faction, empire, faction_empire WHERE faction_empire.empire_id = empire.empire_id AND faction.faction_id = faction_empire.faction_id ORDER BY faction.name ASC', (err, results) => 
    {
        if (err) 
        {
            res.status(500).send(err);
        } 
        else 
        {
            res.json(results); // Send the results as JSON
        }
    });
});

app.get('/weapon_list', (req, res) => 
{
    db.query('SELECT name, strength, damage FROM weapon', (err, results) => {
        if (err) 
        {
            res.status(500).send(err);
        } 
        else 
        {
            res.json(results);
        }
    });
});

// Start the server
app.listen(PORT, () => 
{
    console.log(`Server running on http://localhost:${PORT}`);
});
