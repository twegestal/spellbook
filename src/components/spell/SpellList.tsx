import { Stack } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { SpellListItem } from './SpellListItem';

type Props = {
  spells: Spell[];
  onOpenDetails: (spell: Spell) => void;
};

export function SpellList({ spells, onOpenDetails }: Props) {
  return (
    <Stack gap="sm">
      {spells.map((spell) => (
        <div key={spell.id}>
          <SpellListItem
            spell={spell}
            onOpenDetails={() => onOpenDetails(spell)}
          />
        </div>
      ))}
    </Stack>
  );
}
