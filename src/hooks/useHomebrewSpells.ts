import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';
import { useAuthedMutation } from './useAuthedMutation';
import type { CreateSpell, UpdateSpell } from '../types/spells';

export const useHomebrewSpells = () => {
  const getHomebrewSpells = useApi('getHomebrewSpells');
  return useAuthedQuery({
    queryKey: ['spells', 'homebrew'],
    queryFn: getHomebrewSpells,
  });
};

export const useCreateHomebrewSpell = () => {
  const createHomebrewSpell = useApi('createHomebrewSpell');
  return useAuthedMutation({
    mutationFn: (input: CreateSpell) => createHomebrewSpell(input),
    invalidateKeys: [['spells', 'homebrew']],
  });
};

export const useUpdateHomebrewSpell = () => {
  const updateHomebrewSpell = useApi('updateHomebrewSpell');
  return useAuthedMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSpell }) =>
      updateHomebrewSpell(id, input),
    invalidateKeys: [['spells', 'homebrew']],
  });
};

export const useTogglePublishSpell = () => {
  const togglePublishSpell = useApi('togglePublishSpell');
  return useAuthedMutation({
    mutationFn: (id: string) => togglePublishSpell(id),
    invalidateKeys: [['spells', 'homebrew'], ['spells']],
  });
};

export const useDeleteHomebrewSpell = () => {
  const deleteHomebrewSpell = useApi('deleteHomebrewSpell');
  return useAuthedMutation({
    mutationFn: (id: string) => deleteHomebrewSpell(id),
    invalidateKeys: [['spells', 'homebrew'], ['spells']],
  });
};
