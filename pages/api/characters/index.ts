import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase } from '../../../src/database/connection';
import { CharacterRepository } from '../../../src/database/repositories/CharacterRepository';
import { Character } from '../../../src/database/entities/Character';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initializeDatabase();

  if (req.method === 'GET') {
    try {
      const characters = await CharacterRepository.find();
      res.status(200).json(characters);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching characters' });
    }
  } else if (req.method === 'POST') {
    try {
      const characterData = req.body as Character;
      const newCharacter = CharacterRepository.create(characterData);
      const savedCharacter = await CharacterRepository.save(newCharacter);
      res.status(201).json(savedCharacter);
    } catch (error) {
      res.status(500).json({ message: 'Error creating character' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}