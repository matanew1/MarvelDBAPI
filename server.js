const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;
const db = new sqlite3.Database('marvel-characters.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the database.');
    }
    });
    

app.use(express.json());
app.use(cors());

app.get('/api/characters/names', (req, res) => {
  db.all('SELECT name FROM characters', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/characters/favorites', (req, res) => {
  db.all('SELECT * FROM characters WHERE is_favorite = 1', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


// Fetch all characters with offset and limit
app.get('/api/characters', (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  
  db.all(
    'SELECT * FROM characters LIMIT ? OFFSET ?',
    [parseInt(limit), parseInt(offset)],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// removed character from favorites
app.delete('/api/favorites/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM favorites WHERE character_id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Character removed from favorites successfully' });
  });
});


// Update character
app.put('/api/characters/:id', (req, res) => {
  const { name, rarity, archetype,  is_favorite } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE characters SET name = ?, rarity = ?, archetype = ?, is_favorite = ? WHERE id = ?',
    [name, rarity, archetype, is_favorite, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, name, rarity, archetype, is_favorite });
    }
  );
});

// Delete character
app.delete('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM characters WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Character deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
