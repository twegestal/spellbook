import { useApi } from './useApi';
import { useAuthedMutation } from './useAuthedMutation';
import { useAuthedQuery } from './useAuthedQuery';

type PreparedLevel = { slotLevel: number; remaining: number; maximum: number };

export type SpellSlotsPrepared = {
  kind: 'prepared';
  byLevel: Record<number, { remaining: number; maximum: number }>;
};
export type SpellSlotsPact = {
  kind: 'pact';
  slotLevel: number;
  remaining: number;
  maximum: number;
};

export type SpellSlotsMulticlass = {
  kind: 'multiclass';
  pact: {
    slotLevel: number;
    remaining: number;
    maximum: number;
  };
  byLevel: Record<number, { remaining: number; maximum: number }>;
};

export type SpellSlots =
  | SpellSlotsPrepared
  | SpellSlotsPact
  | SpellSlotsMulticlass;

export function useSpellSlots(characterId: string | undefined) {
  const getSpellSlots = useApi('getSpellSlots');
  return useAuthedQuery<any, unknown, SpellSlots>({
    queryKey: ['slots', characterId],
    enabled: !!characterId,
    queryFn: () => getSpellSlots(characterId!),
    select: (res) => {
      if (res.type === 'pact') {
        return {
          kind: 'pact',
          slotLevel: res.slotLevel,
          remaining: res.remaining,
          maximum: res.maximum,
        } as SpellSlotsPact;
      }

      if (res.type === 'multiclass') {
        const byLevel: Record<number, { remaining: number; maximum: number }> =
          {};
        (res.levels as PreparedLevel[]).forEach((l) => {
          byLevel[l.slotLevel] = { remaining: l.remaining, maximum: l.maximum };
        });
        return {
          kind: 'multiclass',
          pact: res.pact,
          byLevel,
        } as SpellSlotsMulticlass;
      }

      const byLevel: Record<number, { remaining: number; maximum: number }> =
        {};
      (res.levels as PreparedLevel[]).forEach((l) => {
        byLevel[l.slotLevel] = { remaining: l.remaining, maximum: l.maximum };
      });
      return { kind: 'prepared', byLevel } as SpellSlotsPrepared;
    },
  });
}

export function useLongRest(characterId: string | undefined) {
  const longRestApi = useApi('longRest');

  return useAuthedMutation<{ ok: boolean }, Error, void>({
    mutationKey: ['longRest', characterId],
    mutationFn: async () => {
      if (!characterId) throw new Error('Missing characterId');
      return longRestApi(characterId);
    },
    invalidateKeys: characterId
      ? [
          ['slots', characterId],
          ['sorceryPoints', characterId],
          ['resources', characterId],
        ]
      : [],
  });
}

export function useShortRest(characterId: string | undefined) {
  const shortRestApi = useApi('shortRest');

  return useAuthedMutation<{ ok: boolean }, Error, void>({
    mutationKey: ['shortRest', characterId],
    mutationFn: async () => {
      if (!characterId) throw new Error('Missing characterId');
      return shortRestApi(characterId);
    },
    invalidateKeys: characterId
      ? [
          ['slots', characterId],
          ['resources', characterId],
        ]
      : [],
  });
}
