import { Stack, Text, Divider, Group } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { KnownSpellListItem } from './KnownSpellListItem';

type Props = {
  characterId: string;
  spells: Spell[];
  preparedSet: Set<string>;
  onOpenDetails: (spell: Spell) => void;
};

export function KnownSpellList({
  characterId,
  spells,
  preparedSet,
  onOpenDetails,
}: Props) {
  if (!spells.length) {
    return (
      <Group justify="center" py="xl">
        <Text c="dimmed">No spells to show yet.</Text>
      </Group>
    );
  }

  const groups = spells.reduce((acc, spell) => {
    const lvl = spell.level ?? 0;
    if (!acc[lvl]) acc[lvl] = [];
    acc[lvl].push(spell);
    return acc;
  }, {} as Record<number, Spell[]>);

  const sortedLevels = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Stack
      component="ul"
      gap="md"
      style={{ listStyle: 'none', padding: 0, margin: 0 }}
    >
      {sortedLevels.map((lvl, i) => (
        <Stack key={lvl} gap="xs">
          <Text fz="xs" tt="uppercase" c="dimmed" fw={600}>
            {lvl === 0 ? 'Cantrips' : `Level ${lvl}`}
          </Text>

          <Stack gap="sm">
            {groups[lvl]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((spell) => (
                <KnownSpellListItem
                  key={spell.id}
                  characterId={characterId}
                  spell={spell}
                  isPrepared={preparedSet.has(String(spell.id))}
                  onOpenDetails={() => onOpenDetails(spell)}
                />
              ))}
          </Stack>

          {i < sortedLevels.length - 1 && <Divider />}
        </Stack>
      ))}
    </Stack>
  );
}
