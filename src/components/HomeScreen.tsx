import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCharacters, deleteCharacter, Character } from '../services/characterService';

function HomeScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedCharacters = await getCharacters();
      setCharacters(loadedCharacters);
    } catch (error) {
      console.error("Failed to load characters:", error);
      setError("Failed to load characters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    try {
      await deleteCharacter(id);
      await loadCharacters();
      alert("Character deleted successfully!");
    } catch (error) {
      console.error("Failed to delete character:", error);
      alert("Failed to delete character. Please try again.");
    }
  };

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-4 text-center">Loading characters...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-parchment">
      <h1 className="text-3xl font-bold mb-4 text-center text-brown-800">Character Sheets</h1>
      <Link to="/character" className="bg-brown-600 text-white p-3 rounded-lg mb-4 block text-center">
        Create New Character
      </Link>
      <input
        className="border-2 border-brown-400 p-2 rounded-lg mb-4 w-full"
        placeholder="Search characters..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredCharacters.map((character) => (
        <div key={character.id} className="bg-brown-100 p-3 rounded-lg mb-3 border-2 border-brown-300">
          <h2 className="font-bold text-lg text-brown-800">{character.name}</h2>
          <p className="text-brown-600">{`${character.species} ${character.class} (Level ${character.level})`}</p>
          <div className="flex justify-between mt-2">
            <Link to={`/character/${character.id}`} className="bg-blue-500 text-white p-2 rounded-lg">
              Edit
            </Link>
            <button
              className="bg-red-500 text-white p-2 rounded-lg"
              onClick={() => character.id && handleDeleteCharacter(character.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomeScreen;