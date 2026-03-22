import { useApi } from './useApi';
import { useAuthedQuery } from './useAuthedQuery';
import { useAuthedMutation } from './useAuthedMutation';
import type { SorceryPoints } from '../types/sorceryPoints';

export function useSorceryPoints(characterId: string | undefined) {
  const getSorceryPoints = useApi('getSorceryPoints');

  return useAuthedQuery<any, unknown, SorceryPoints>({
    queryKey: ['sorceryPoints', characterId],
    enabled: !!characterId,
    queryFn: () => getSorceryPoints(characterId!),
  });
}

export function useSpendSorceryPoints(characterId: string | undefined) {
  const spendSorceryPoints = useApi('spendSorceryPoints');

  return useAuthedMutation<{ ok: boolean }, Error, { qty: number }>({
    mutationKey: ['sorceryPoints:spend', characterId],
    mutationFn: async ({ qty }) => {
      if (!characterId) throw new Error('Missing characterId');
      return spendSorceryPoints(characterId, { qty });
    },
    invalidateKeys: characterId ? [['sorceryPoints', characterId]] : [],
  });
}

export function useRecoverSorceryPoints(characterId: string | undefined) {
  const recoverSorceryPoints = useApi('recoverSorceryPoints');

  return useAuthedMutation<{ ok: boolean }, Error, { qty: number }>({
    mutationKey: ['sorceryPoints:recover', characterId],
    mutationFn: async ({ qty }) => {
      if (!characterId) throw new Error('Missing characterId');
      return recoverSorceryPoints(characterId, { qty });
    },
    invalidateKeys: characterId ? [['sorceryPoints', characterId]] : [],
  });
}
