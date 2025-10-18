export type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  created_at: string;
  updated_at: string;
};

export type CreateCharacterInput = {
  name: string;
  race: string;
  class: string;
  level: number;
};

export type CharacterListResponse = { results: Character[] };
