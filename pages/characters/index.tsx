import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Character } from '../../src/database/entities/Character';

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      } else {
        console.error('Failed to fetch characters');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCharacters();
      } else {
        console.error('Failed to delete character');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medieval text-brown-800 mb-6">Characters</h1>
      <Link href="/characters/new">
        <a className="bg-brown-600 text-white px-4 py-2 rounded-lg mb-4 inline-block">Create New Character</a>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <div key={character.id} className="bg-brown-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-medieval text-brown-800 mb-2">{character.name}</h2>
            <p className="text-brown-600 mb-2">{character.species} {character.class} (Level {character.level})</p>
            <div className="flex justify-between">
              <Link href={`/characters/${character.id}`}>
                <a className="bg-blue-500 text-white px-3 py-1 rounded">Edit</a>
              </Link>
              <button
                onClick={() => handleDelete(character.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}