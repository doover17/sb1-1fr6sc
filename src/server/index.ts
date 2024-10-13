import express from 'express';
import { Character } from '../services/characterService';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import multer from 'multer';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

let db: sqlite3.Database;

(async () => {
  db = await open({
    filename: './characters.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      class TEXT NOT NULL,
      level INTEGER NOT NULL,
      strength INTEGER NOT NULL,
      dexterity INTEGER NOT NULL,
      constitution INTEGER NOT NULL,
      intelligence INTEGER NOT NULL,
      wisdom INTEGER NOT NULL,
      charisma INTEGER NOT NULL,
      skills TEXT,
      weaponProficiencies TEXT,
      armorProficiencies TEXT,
      toolProficiencies TEXT,
      equipment TEXT,
      abilities TEXT
    )
  `);
})();

app.post('/api/characters', async (req, res) => {
  const newCharacter: Character = {
    id: Date.now().toString(),
    ...req.body
  };

  try {
    await db.run(`
      INSERT INTO characters (
        id, name, species, class, level, strength, dexterity, constitution,
        intelligence, wisdom, charisma, skills, weaponProficiencies,
        armorProficiencies, toolProficiencies, equipment, abilities
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newCharacter.id,
      newCharacter.name,
      newCharacter.species,
      newCharacter.class,
      newCharacter.level,
      newCharacter.strength,
      newCharacter.dexterity,
      newCharacter.constitution,
      newCharacter.intelligence,
      newCharacter.wisdom,
      newCharacter.charisma,
      JSON.stringify(newCharacter.skills),
      JSON.stringify(newCharacter.weaponProficiencies),
      JSON.stringify(newCharacter.armorProficiencies),
      JSON.stringify(newCharacter.toolProficiencies),
      JSON.stringify(newCharacter.equipment),
      JSON.stringify(newCharacter.abilities)
    ]);

    res.status(201).json(newCharacter);
  } catch (error) {
    console.error("Failed to save character:", error);
    res.status(500).json({ message: "Failed to save character" });
  }
});

app.get('/api/characters', async (req, res) => {
  try {
    const characters = await db.all('SELECT * FROM characters');
    res.json(characters.map(parseCharacter));
  } catch (error) {
    console.error("Failed to retrieve characters:", error);
    res.status(500).json({ message: "Failed to retrieve characters" });
  }
});

app.get('/api/characters/:id', async (req, res) => {
  try {
    const character = await db.get('SELECT * FROM characters WHERE id = ?', req.params.id);
    if (character) {
      res.json(parseCharacter(character));
    } else {
      res.status(404).json({ message: "Character not found" });
    }
  } catch (error) {
    console.error("Failed to retrieve character:", error);
    res.status(500).json({ message: "Failed to retrieve character" });
  }
});

app.put('/api/characters/:id', async (req, res) => {
  const updatedCharacter: Character = req.body;

  try {
    await db.run(`
      UPDATE characters SET
        name = ?, species = ?, class = ?, level = ?, strength = ?, dexterity = ?,
        constitution = ?, intelligence = ?, wisdom = ?, charisma = ?, skills = ?,
        weaponProficiencies = ?, armorProficiencies = ?, toolProficiencies = ?,
        equipment = ?, abilities = ?
      WHERE id = ?
    `, [
      updatedCharacter.name,
      updatedCharacter.species,
      updatedCharacter.class,
      updatedCharacter.level,
      updatedCharacter.strength,
      updatedCharacter.dexterity,
      updatedCharacter.constitution,
      updatedCharacter.intelligence,
      updatedCharacter.wisdom,
      updatedCharacter.charisma,
      JSON.stringify(updatedCharacter.skills),
      JSON.stringify(updatedCharacter.weaponProficiencies),
      JSON.stringify(updatedCharacter.armorProficiencies),
      JSON.stringify(updatedCharacter.toolProficiencies),
      JSON.stringify(updatedCharacter.equipment),
      JSON.stringify(updatedCharacter.abilities),
      req.params.id
    ]);

    res.json(updatedCharacter);
  } catch (error) {
    console.error("Failed to update character:", error);
    res.status(500).json({ message: "Failed to update character" });
  }
});

app.delete('/api/characters/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM characters WHERE id = ?', req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete character:", error);
    res.status(500).json({ message: "Failed to delete character" });
  }
});

app.post('/api/characters/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const fileContent = await fs.promises.readFile(req.file.path, 'utf-8');
    const importedCharacter: Character = JSON.parse(fileContent);

    // Validate imported data
    if (!validateImportedCharacter(importedCharacter)) {
      return res.status(400).json({ message: "Invalid character data" });
    }

    // Save the imported character to the database
    const result = await db.run(`
      INSERT INTO characters (
        id, name, species, class, level, strength, dexterity, constitution,
        intelligence, wisdom, charisma, skills, weaponProficiencies,
        armorProficiencies, toolProficiencies, equipment, abilities
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      Date.now().toString(),
      importedCharacter.name,
      importedCharacter.species,
      importedCharacter.class,
      importedCharacter.level,
      importedCharacter.strength,
      importedCharacter.dexterity,
      importedCharacter.constitution,
      importedCharacter.intelligence,
      importedCharacter.wisdom,
      importedCharacter.charisma,
      JSON.stringify(importedCharacter.skills),
      JSON.stringify(importedCharacter.weaponProficiencies),
      JSON.stringify(importedCharacter.armorProficiencies),
      JSON.stringify(importedCharacter.toolProficiencies),
      JSON.stringify(importedCharacter.equipment),
      JSON.stringify(importedCharacter.abilities)
    ]);

    res.status(201).json({ message: "Character imported successfully", id: result.lastID });
  } catch (error) {
    console.error("Failed to import character:", error);
    res.status(500).json({ message: "Failed to import character" });
  } finally {
    // Clean up the uploaded file
    await fs.promises.unlink(req.file.path);
  }
});

function parseCharacter(dbCharacter: any): Character {
  return {
    ...dbCharacter,
    skills: JSON.parse(dbCharacter.skills),
    weaponProficiencies: JSON.parse(dbCharacter.weaponProficiencies),
    armorProficiencies: JSON.parse(dbCharacter.armorProficiencies),
    toolProficiencies: JSON.parse(dbCharacter.toolProficiencies),
    equipment: JSON.parse(dbCharacter.equipment),
    abilities: JSON.parse(dbCharacter.abilities)
  };
}

function validateImportedCharacter(importedCharacter: any): importedCharacter is Character {
  // Add more validation as needed
  return (
    typeof importedCharacter.name === 'string' &&
    typeof importedCharacter.species === 'string' &&
    typeof importedCharacter.class === 'string' &&
    typeof importedCharacter.level === 'number' &&
    typeof importedCharacter.strength === 'number' &&
    typeof importedCharacter.dexterity === 'number' &&
    typeof importedCharacter.constitution === 'number' &&
    typeof importedCharacter.intelligence === 'number' &&
    typeof importedCharacter.wisdom === 'number' &&
    typeof importedCharacter.charisma === 'number' &&
    Array.isArray(importedCharacter.skills) &&
    Array.isArray(importedCharacter.weaponProficiencies) &&
    Array.isArray(importedCharacter.armorProficiencies) &&
    Array.isArray(importedCharacter.toolProficiencies) &&
    Array.isArray(importedCharacter.equipment) &&
    Array.isArray(importedCharacter.abilities)
  );
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});