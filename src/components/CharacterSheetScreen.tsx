import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveCharacter, getCharacterById, Character } from '../services/characterService';
import CollapsibleSection from './CollapsibleSection';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function CharacterSheetScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character>({
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
    abilities: []
  });

  useEffect(() => {
    if (id) {
      getCharacterById(id).then(loadedCharacter => {
        if (loadedCharacter) {
          setCharacter(loadedCharacter);
        }
      });
    }
  }, [id]);

  const characterSheetRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    try {
      // Create a new object with only serializable data
      const serializableCharacter = JSON.parse(JSON.stringify(character));
      await saveCharacter(serializableCharacter);
      alert('Character saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to save character:', error);
      alert('Failed to save character. Please try again.');
    }
  };

  // ... rest of the component code remains the same

  return (
    <div className="p-4 bg-parchment">
      {/* ... rest of the JSX remains the same */}
      <button
        className="bg-brown-600 text-white p-3 rounded-lg mt-4 w-full"
        onClick={handleSave}
      >
        Save Character
      </button>
    </div>
  );
}

export default CharacterSheetScreen;