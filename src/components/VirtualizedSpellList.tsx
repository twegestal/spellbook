import { Virtuoso } from 'react-virtuoso';
import type { Spell } from '../types/spells';
import { Stack } from '@mantine/core';
import { SpellListItem } from './spell/SpellListItem';

type Props = {
  spells: Spell[];
  onOpenDetails: (spell: Spell) => void;
};

export function VirtualizedSpellList({ spells, onOpenDetails }: Props) {
  return (
    <Stack gap="sm" h="calc(100vh - 200px)">
      <Virtuoso
        style={{ height: '100%' }}
        data={spells}
        overscan={150}
        components={{
          List: (props) => <Stack gap="sm" {...props} />,
        }}
        itemContent={(index, spell) => (
          <SpellListItem
            key={spell.id ?? index}
            spell={spell}
            onOpenDetails={() => onOpenDetails(spell)}
          />
        )}
      />
    </Stack>
  );
}
