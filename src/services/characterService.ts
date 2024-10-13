import axios from 'axios';

export interface Character {
  id?: string;
  name: string;
  species: string;
  class: string;
  level: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  skills: string[];
  weaponProficiencies: string[];
  armorProficiencies: string[];
  toolProficiencies: string[];
  equipment: string[];
  abilities: string[];
}

const API_URL = 'http://localhost:3000/api';

function logError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error('Axios error:', error.message, error.response?.data);
  } else if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}

export async function saveCharacter(character: Character): Promise<void> {
  try {
    if (character.id) {
      await axios.put(`${API_URL}/characters/${character.id}`, character);
    } else {
      await axios.post(`${API_URL}/characters`, character);
    }
  } catch (error) {
    logError(error);
    throw new Error('Failed to save character');
  }
}

export async function getCharacters(): Promise<Character[]> {
  try {
    const response = await axios.get(`${API_URL}/characters`);
    return response.data;
  } catch (error) {
    logError(error);
    throw new Error('Failed to get characters');
  }
}

export async function getCharacterById(id: string): Promise<Character | null> {
  try {
    const response = await axios.get(`${API_URL}/characters/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    logError(error);
    throw new Error('Failed to get character');
  }
}

export async function deleteCharacter(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/characters/${id}`);
  } catch (error) {
    logError(error);
    throw new Error('Failed to delete character');
  }
}

export async function importCharacter(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/characters/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.id;
  } catch (error) {
    logError(error);
    throw new Error('Failed to import character');
  }
}