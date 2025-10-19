import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';

export const useSpells = () => {
  const getAllSpells = useApi('getAllSpells');
  return useAuthedQuery({
    queryKey: ['spells'],
    queryFn: getAllSpells,
  });
};
