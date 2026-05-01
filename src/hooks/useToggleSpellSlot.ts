import { useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useAuthedMutation } from './useAuthedMutation';
import { useApi } from './useApi';

type RawPreparedLevel = {
  slotLevel: number;
  remaining: number;
  maximum: number;
};
type RawSlotsPrepared = { type: 'prepared'; levels: RawPreparedLevel[] };
type RawSlotsPact = {
  type: 'pact';
  slotLevel: number;
  remaining: number;
  maximum: number;
};
type RawSlotsMulticlass = {
  type: 'multiclass';
  pact: { slotLevel: number; remaining: number; maximum: number };
  levels: RawPreparedLevel[];
};
type RawSlots = RawSlotsPrepared | RawSlotsPact | RawSlotsMulticlass;

type Vars = {
  characterId: string;
  slotLevel: number;
  slotIndex: number;
  spellId?: string;
  note?: string;
  isPact?: boolean;
};
type Ctx = { prev?: RawSlots };

export function useToggleSpellSlot() {
  const toggleSpellSlot = useApi('toggleSpellSlot');
  const qc = useQueryClient();

  return useAuthedMutation<
    {
      characterId: string;
      slotLevel: number;
      slotIndex: number;
      spent: boolean;
    },
    unknown,
    Vars,
    Ctx
  >({
    mutationKey: ['toggle-slot'],
    mutationFn: (v) => toggleSpellSlot(v),

    onMutate: async (vars) => {
      const key = ['slots', vars.characterId] as const;
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<RawSlots>(key);
      if (!prev) return { prev };

      let next: RawSlots = prev;

      if (prev.type === 'prepared') {
        const levels = prev.levels.map((l) => ({ ...l }));
        const idx = levels.findIndex((l) => l.slotLevel === vars.slotLevel);
        if (idx !== -1) {
          const row = levels[idx];
          const spentCount = row.maximum - row.remaining;
          const isBubbleSpent = vars.slotIndex <= spentCount;
          const remaining = Math.max(
            0,
            Math.min(row.maximum, row.remaining + (isBubbleSpent ? 1 : -1)),
          );
          levels[idx] = { ...row, remaining };
          next = { type: 'prepared', levels };
        }
      } else if (prev.type === 'pact' && prev.slotLevel === vars.slotLevel) {
        const spentCount = prev.maximum - prev.remaining;
        const isBubbleSpent = vars.slotIndex <= spentCount;
        const remaining = Math.max(
          0,
          Math.min(prev.maximum, prev.remaining + (isBubbleSpent ? 1 : -1)),
        );
        next = { ...prev, remaining };
      } else if (prev.type === 'multiclass') {
        if (vars.isPact) {
          const pact = { ...prev.pact };
          const spentCount = pact.maximum - pact.remaining;
          const isBubbleSpent = vars.slotIndex <= spentCount;
          const remaining = Math.max(
            0,
            Math.min(pact.maximum, pact.remaining + (isBubbleSpent ? 1 : -1)),
          );
          next = { ...prev, pact: { ...pact, remaining } };
        } else {
          const levels = prev.levels.map((l) => ({ ...l }));
          const idx = levels.findIndex((l) => l.slotLevel === vars.slotLevel);
          if (idx !== -1) {
            const row = levels[idx];
            const spentCount = row.maximum - row.remaining;
            const isBubbleSpent = vars.slotIndex <= spentCount;
            const remaining = Math.max(
              0,
              Math.min(row.maximum, row.remaining + (isBubbleSpent ? 1 : -1)),
            );
            levels[idx] = { ...row, remaining };
            next = { ...prev, levels };
          }
        }
      }

      qc.setQueryData(key, next);
      return { prev };
    },

    onError: (err, vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(['slots', vars.characterId] as const, ctx.prev);
      }
      const message =
        err instanceof Error ? err.message : 'Failed to update spell slot';
      notifications.show({
        color: 'red',
        title: 'Could not update slot',
        message,
      });
    },

    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: ['slots', vars.characterId] as const });
    },
  });
}
