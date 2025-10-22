import { useApi } from './useApi';
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

export type SpellSlots = SpellSlotsPrepared | SpellSlotsPact;

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
      const byLevel: Record<number, { remaining: number; maximum: number }> =
        {};
      (res.levels as PreparedLevel[]).forEach((l) => {
        byLevel[l.slotLevel] = { remaining: l.remaining, maximum: l.maximum };
      });
      return { kind: 'prepared', byLevel } as SpellSlotsPrepared;
    },
  });
}
