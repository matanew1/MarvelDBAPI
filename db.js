const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('marvel-characters.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// set fedault archetype to "Unknown"
db.run(`UPDATE characters SET archetype = 'Unknown' WHERE archetype IS NULL`, (err) => {
    if (err) {
        console.error('Error updating database ' + err.message);
    } else {
        console.log('Default archetype set to "Unknown" for characters with NULL archetype.');
    }
});


