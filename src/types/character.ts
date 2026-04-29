export type CharacterClass = {
  id: number;
  name: string;
  level: number;
};

export type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
  classes: CharacterClass[];
  level: number;
  is_retired: boolean;
  created_at: string;
  updated_at: string;
};

export type CharacterListResponse = {
  results: Character[];
};

export type CreateCharacterInput = {
  name: string;
  race: string;
  class: string;
  level: number;
};
