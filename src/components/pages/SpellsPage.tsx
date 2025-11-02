import { useMemo } from 'react';
import { Box, Center, Loader, Stack, Text } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { useSpells } from '../../hooks/useSpell';
import { useSpellSearch } from '../../hooks/useSpellSearch';
import { SpellList } from '../spell/SpellList';
import { openSpellModal } from '../overlays/openSpellModal';

export default function SpellsPage() {
  const { data, isLoading } = useSpells();
  const { spells } = useSpellSearch(data, '');

  const grouped = useMemo(() => {
    const groups = (spells ?? []).reduce((acc, s) => {
      const lvl = s.level ?? 0;
      (acc[lvl] ??= []).push(s);
      return acc;
    }, {} as Record<number, Spell[]>);

    const levels = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b);

    for (const lvl of levels) {
      groups[lvl].sort((a, b) => a.name.localeCompare(b.name));
    }

    return { groups, levels };
  }, [spells]);

  if (isLoading) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  if (!grouped.levels.length) {
    return (
      <Center mih="50vh">
        <Text c="dimmed">No spells to show yet.</Text>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      {grouped.levels.map((lvl) => (
        <Box key={lvl}>
          <Text fw={600} c="dimmed" tt="uppercase" fz="xs" mb="xs">
            {lvl === 0 ? 'Cantrips' : `Level ${lvl}`}
          </Text>
          <SpellList
            spells={grouped.groups[lvl]}
            onOpenDetails={(spell) => openSpellModal(spell)}
          />
        </Box>
      ))}
    </Stack>
  );
}
