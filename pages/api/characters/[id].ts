import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase } from '../../../src/database/connection';
import { CharacterRepository } from '../../../src/database/repositories/CharacterRepository';
import { Character } from '../../../src/database/entities/Character';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initializeDatabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const character = await CharacterRepository.findOne({ where: { id: id as string } });
      if (character) {
        res.status(200).json(character);
      } else {
        res.status(404).json({ message: 'Character not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching character' });
    }
  } else if (req.method === 'PUT') {
    try {
      const characterData = req.body as Character;
      const updateResult = await CharacterRepository.update(id as string, characterData);
      if (updateResult.affected === 1) {
        const updatedCharacter = await CharacterRepository.findOne({ where: { id: id as string } });
        res.status(200).json(updatedCharacter);
      } else {
        res.status(404).json({ message: 'Character not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating character' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleteResult = await CharacterRepository.delete(id as string);
      if (deleteResult.affected === 1) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Character not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting character' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}