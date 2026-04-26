import type { MetaItem, MetaResponse } from '../types/meta';
import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';

const oneDay = 24 * 60 * 60 * 1000;

export const useRaces = () => {
  const getRaces = useApi('getRaces');
  return useAuthedQuery<MetaResponse, unknown, MetaItem[]>({
    queryKey: ['meta', 'races'],
    queryFn: getRaces,
    select: (data) => data.results,
    staleTime: oneDay,
  });
};

export const useClasses = () => {
  const getClasses = useApi('getClasses') as () => Promise<MetaResponse>;
  return useAuthedQuery<MetaResponse, unknown, MetaItem[]>({
    queryKey: ['meta', 'classes'],
    queryFn: getClasses,
    select: (data) => data.results,
    staleTime: oneDay,
  });
};

export const useSchools = () => {
  const getSchools = useApi('getSchools');
  return useAuthedQuery({
    queryKey: ['meta', 'schools'],
    queryFn: getSchools,
    staleTime: Infinity,
  });
};

export const useDamageTypes = () => {
  const getDamageTypes = useApi('getDamageTypes');
  return useAuthedQuery({
    queryKey: ['meta', 'damage-types'],
    queryFn: getDamageTypes,
    staleTime: Infinity,
  });
};

export const useSpellClasses = () => {
  const getSpellClasses = useApi('getSpellClasses');
  return useAuthedQuery({
    queryKey: ['meta', 'spell-classes'],
    queryFn: getSpellClasses,
    staleTime: Infinity,
  });
};
