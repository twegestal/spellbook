import { Box, Stack, Text, Separator } from '@chakra-ui/react';
import type { Spell } from '../../types/spells';
import { SpellListItem } from './SpellListItem';
import type { RefObject } from 'react';

type SpellListProps = {
  spells: Spell[];
  onOpenDetails: (spell: Spell) => void;
  overlayContainer?: RefObject<HTMLDivElement | null>;
};

export function SpellList({
  spells,
  onOpenDetails,
  overlayContainer,
}: SpellListProps) {
  if (!spells.length) {
    return (
      <Box display="grid" placeItems="center" h="full" py={8}>
        <Text opacity={0.7}>No spells to show yet.</Text>
      </Box>
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
    <Stack as="ul" gap={3}>
      {sortedLevels.map((lvl, i) => (
        <Box key={lvl}>
          <Text
            fontWeight="semibold"
            color="fg.muted"
            mb={2}
            fontSize="xs"
            textTransform="uppercase"
          >
            {lvl === 0 ? 'Cantrips' : `Level ${lvl}`}
          </Text>

          <Stack gap={3}>
            {groups[lvl]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((spell) => (
                <SpellListItem
                  key={spell.id}
                  spell={spell}
                  onOpenDetails={() => onOpenDetails(spell)}
                  overlayContainer={overlayContainer}
                />
              ))}
          </Stack>

          {i < sortedLevels.length - 1 && <Separator my={4} />}
        </Box>
      ))}
    </Stack>
  );
}
