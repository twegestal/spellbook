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
