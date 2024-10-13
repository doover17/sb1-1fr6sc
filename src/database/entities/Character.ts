import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Character {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column()
  class: string;

  @Column()
  level: number;

  @Column()
  strength: number;

  @Column()
  dexterity: number;

  @Column()
  constitution: number;

  @Column()
  intelligence: number;

  @Column()
  wisdom: number;

  @Column()
  charisma: number;

  @Column("simple-array")
  skills: string[];

  @Column("simple-array")
  weaponProficiencies: string[];

  @Column("simple-array")
  armorProficiencies: string[];

  @Column("simple-array")
  toolProficiencies: string[];

  @Column("simple-array")
  equipment: string[];

  @Column("simple-array")
  abilities: string[];
}