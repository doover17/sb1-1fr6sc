import { AppDataSource } from "../connection";
import { Character } from "../entities/Character";

export const CharacterRepository = AppDataSource.getRepository(Character);