import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Character } from '../../src/database/entities/Character';

export default function CharacterForm() {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState<Character>({
    id: '',
    name: '',
    species: '',
    class: '',
    level: 1,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    skills: [],
    weaponProficiencies: [],
    armorProficiencies: [],
    toolProficiencies: [],
    equipment: [],
    abilities: [],
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchCharacter();
    }
  }, [id]);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(`/api/characters/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCharacter(data);
      } else {
        console.error('Failed to fetch character');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = id === 'new' ? '/api/characters' : `/api/characters/${id}`;
      const method = id === 'new' ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character),
      });
      if (response.ok) {
        router.push('/characters');
      } else {
        console.error('Failed to save character');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medieval text-brown-800 mb-6">
        {id === 'new' ? 'Create New Character' : 'Edit Character'}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-brown-700 font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={character.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-brown-300 rounded-lg focus:outline-none focus:border-brown-500"
            required
          />
        </div>
        {/* Add more form fields for other character properties */}
        <button type="submit" className="bg-brown-600 text-white px-4 py-2 rounded-lg hover:bg-brown-700">
          Save Character
        </button>
      </form>
    </div>
  );
}
</boltArtifact>

Now that we have set up the database, API routes, and frontend pages, let's update the `package.json` to include the necessary dependencies:

<boltArtifact id="update-dependencies" title="Update package.json with necessary dependencies">
<boltAction type="file" filePath="package.json">
{
  "name": "character-sheet-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.15",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sqlite3": "^5.1.6",
    "typeorm": "^0.3.16",
    "reflect-metadata": "^0.1.13"
  },
  "devDependencies": {
    "@types/node": "^20.2.5",
    "@types/react": "^18.2.8",
    "@types/react-dom": "^18.2.4",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.42.0",
    "eslint-config-next": "^13.4.4",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.1.3"
  }
}