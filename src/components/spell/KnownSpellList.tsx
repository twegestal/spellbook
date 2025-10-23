import { Stack, Box, Text, Separator } from '@chakra-ui/react';
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
                <KnownSpellListItem
                  key={spell.id}
                  characterId={characterId}
                  spell={spell}
                  isPrepared={preparedSet.has(String(spell.id))}
                  onOpenDetails={() => onOpenDetails(spell)}
                />
              ))}
          </Stack>

          {i < sortedLevels.length - 1 && <Separator my={4} />}
        </Box>
      ))}
    </Stack>
  );
}
