import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';
import { useAuthedMutation } from './useAuthedMutation';
import type { CharacterResource } from '../types/resources';

export function useResources(characterId: string | undefined) {
  const getResources = useApi('getResources');
  return useAuthedQuery<CharacterResource[]>({
    queryKey: ['resources', characterId],
    enabled: !!characterId,
    queryFn: () => getResources(characterId!),
  });
}

export function useSetResource(characterId: string | undefined) {
  const setResource = useApi('setResource');
  return useAuthedMutation<
    CharacterResource,
    Error,
    { key: string; maximum: number; resets_on?: 'long' | 'short' }
  >({
    mutationKey: ['resources:set', characterId],
    mutationFn: ({ key, maximum, resets_on = 'long' }) => {
      if (!characterId) throw new Error('Missing characterId');
      return setResource(characterId, key, maximum, resets_on);
    },
    invalidateKeys: characterId ? [['resources', characterId]] : [],
  });
}

export function useSpendResource(characterId: string | undefined) {
  const spendResource = useApi('spendResource');
  return useAuthedMutation<
    CharacterResource,
    Error,
    { key: string; qty?: number }
  >({
    mutationKey: ['resources:spend', characterId],
    mutationFn: ({ key, qty = 1 }) => {
      if (!characterId) throw new Error('Missing characterId');
      return spendResource(characterId, key, qty);
    },
    invalidateKeys: characterId ? [['resources', characterId]] : [],
  });
}

export function useRestoreResource(characterId: string | undefined) {
  const restoreResource = useApi('restoreResource');
  return useAuthedMutation<
    CharacterResource,
    Error,
    { key: string; qty?: number }
  >({
    mutationKey: ['resources:restore', characterId],
    mutationFn: ({ key, qty }) => {
      if (!characterId) throw new Error('Missing characterId');
      return restoreResource(characterId, key, qty);
    },
    invalidateKeys: characterId ? [['resources', characterId]] : [],
  });
}
