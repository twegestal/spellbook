/* import { useQueryClient } from '@tanstack/react-query';
import { useAuthedMutation } from './useAuthedMutation';
import { useApi } from './useApi';
import type {
  SpellSlots,
  SpellSlotsPrepared,
  SpellSlotsPact,
} from './useSpellSlots';

type Vars = {
  characterId: string;
  slotLevel: number; // 1..9
  slotIndex: number; // 1..N (N = maximum for that level)
  // optional: spellId / note if you want to attach a spell later
  spellId?: string;
  note?: string;
};

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
    Vars
  >({
    mutationFn: (v) => toggleSpellSlot(v),

    // Optimistic UI for the simple “fill left-to-right” model
    onMutate: async (vars) => {
      const key = ['slots', vars.characterId];
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<SpellSlots>(key);
      if (!prev) return { prev };

      // make a shallow copy to mutate safely
      let next: SpellSlots = prev;

      if (prev.kind === 'prepared') {
        const byLevel = { ...prev.byLevel };
        const row = byLevel[vars.slotLevel];
        if (row) {
          const spentCount = Math.max(
            0,
            Math.min(row.maximum, row.maximum - row.remaining)
          );
          const isCurrentlySpent = vars.slotIndex <= spentCount;

          const remaining = Math.max(
            0,
            Math.min(
              row.maximum,
              row.remaining + (isCurrentlySpent ? 1 : -1) // recover -> +1, spend -> -1
            )
          );

          byLevel[vars.slotLevel] = { ...row, remaining };
          next = { kind: 'prepared', byLevel };
        }
      } else {
        // pact
        if (vars.slotLevel === prev.slotLevel) {
          const spentCount = prev.maximum - prev.remaining;
          const isCurrentlySpent = vars.slotIndex <= spentCount;
          const remaining = Math.max(
            0,
            Math.min(prev.maximum, prev.remaining + (isCurrentlySpent ? 1 : -1))
          );
          next = {
            kind: 'pact',
            slotLevel: prev.slotLevel,
            maximum: prev.maximum,
            remaining,
          };
        }
      }

      qc.setQueryData(key, next);
      return { prev };
    },

    onError: (_err, vars, ctx) => {
      // rollback
      if (ctx?.prev) {
        qc.setQueryData(['slots', vars.characterId], ctx.prev);
      }
    },

    onSettled: (_data, _err, vars) => {
      // final truth from server
      qc.invalidateQueries({ queryKey: ['slots', vars.characterId] });
    },
  });
}
 */
