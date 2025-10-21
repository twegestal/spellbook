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

  assignKnownSpell: (body: { characterId: string; spellId: string }) =>
    api
      .post(`characters/${body.characterId}/known-spells`, {
        json: { spellId: body.spellId },
      })
      .json<{ character_id: string; spell_id: string; added_at: string }>(),

  removeKnownSpell: (characterId: string, spellId: string) =>
    api
      .delete(`characters/${characterId}/known-spells/${spellId}`)
      .json<{ ok: true }>(),
});
