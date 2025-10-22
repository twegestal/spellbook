import { useQueryClient } from '@tanstack/react-query';
import { useAuthedMutation } from './useAuthedMutation';
import { useApi } from './useApi';
import type { SpellSlots } from './useSpellSlots';

type Vars = {
  characterId: string;
  slotLevel: number;
  slotIndex: number;
  spellId?: string;
  note?: string;
};

type Ctx = { prev?: SpellSlots };

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
    mutationFn: (v) => toggleSpellSlot(v),

    onMutate: async (vars) => {
      const key = ['slots', vars.characterId];
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<SpellSlots>(key);
      if (!prev) return { prev };

      let next: SpellSlots = prev;

      if (prev.kind === 'prepared') {
        const byLevel = { ...prev.byLevel };
        const row = byLevel[vars.slotLevel];
        if (row) {
          const spentCount = row.maximum - row.remaining;
          const isBubbleSpent = vars.slotIndex <= spentCount;
          const remaining = Math.max(
            0,
            Math.min(row.maximum, row.remaining + (isBubbleSpent ? 1 : -1))
          );
          byLevel[vars.slotLevel] = { ...row, remaining };
          next = { kind: 'prepared', byLevel };
        }
      } else {
        if (vars.slotLevel === prev.slotLevel) {
          const spentCount = prev.maximum - prev.remaining;
          const isBubbleSpent = vars.slotIndex <= spentCount;
          const remaining = Math.max(
            0,
            Math.min(prev.maximum, prev.remaining + (isBubbleSpent ? 1 : -1))
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
      if (ctx?.prev) {
        qc.setQueryData(['slots', vars.characterId], ctx.prev);
      }
    },

    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: ['slots', vars.characterId] });
    },
  });
}
