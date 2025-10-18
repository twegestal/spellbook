import type { Character, CharacterListResponse } from '../types/character';
import ky from 'ky';

export const characterApi = (api: typeof ky) => ({
  listCharacters: () => api.get('characters').json<CharacterListResponse>(),
  createCharacter: (body: {
    name: string;
    race: string;
    class: string;
    level: number;
  }) => api.post('characters', { json: body }).json<Character>(),
});
