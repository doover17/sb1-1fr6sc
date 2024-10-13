import { DataSource } from "typeorm";
import { Character } from "./entities/Character";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "character_sheet.sqlite",
  entities: [Character],
  synchronize: true,
  logging: false,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization", err);
    throw err;
  }
};