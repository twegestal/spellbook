// src/hooks/useCharacters.ts
import { useAuthedQuery } from './useAuthedQuery';
import { useApi } from './useApi';
import type {
  Character,
  CharacterListResponse,
  CreateCharacterInput,
} from '../types/character';
import { useAuthedMutation } from './useAuthedMutation';

export const useCharacters = () => {
  const listCharacters = useApi('listCharacters');
  return useAuthedQuery<CharacterListResponse, unknown, Character[]>({
    queryKey: ['characters'],
    queryFn: listCharacters,
    select: (data) => data.results,
  });
};

export const useCreateCharacter = () => {
  const createCharacter = useApi('createCharacter');
  return useAuthedMutation<Character, unknown, CreateCharacterInput>({
    mutationFn: createCharacter,
    invalidateKeys: [['characters']],
  });
};

export const useAssignKnownSpell = () => {
  const assignKnownSpell = useApi('assignKnownSpell');
  return useAuthedMutation<
    { character_id: string; spell_id: string; added_at: string },
    unknown,
    { characterId: string; spellId: string }
  >({
    mutationFn: assignKnownSpell,
    invalidateKeys: [['characters']],
  });
};

export const useRemoveKnownSpell = () => {
  const removeKnownSpell = useApi('removeKnownSpell');
  return useAuthedMutation<
    { ok: true },
    unknown,
    { characterId: string; spellId: string }
  >({
    mutationFn: ({ characterId, spellId }) =>
      removeKnownSpell(characterId, spellId),
    invalidateKeys: [['characters']],
  });
};
