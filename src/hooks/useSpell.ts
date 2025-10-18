import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';

export const useSpells = () => {
  const getAllSpells = useApi('getAllSpells');
  return useAuthedQuery({
    queryKey: ['spells'],
    queryFn: getAllSpells,
  });
};

export const useSpellByIndex = (index?: string) => {
  const getSpellByIndex = useApi('getSpellByIndex');
  return useAuthedQuery({
    queryKey: ['spell', index],
    queryFn: () => getSpellByIndex(index!),
    enabled: !!index,
    staleTime: 5 * 60 * 1000,
  });
};
