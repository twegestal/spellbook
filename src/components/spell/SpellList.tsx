import { Box, Stack, Text } from '@chakra-ui/react';
import type { Spell } from '@/types/spells';
import { SpellListItem } from './SpellListItem';

type SpellListProps = {
  spells: Spell[];
  onOpenDetails: (spell: Spell) => void;
};

export function SpellList({ spells, onOpenDetails }: SpellListProps) {
  if (!spells.length) {
    return (
      <Box display="grid" placeItems="center" h="full" py={8}>
        <Text opacity={0.7}>No spells to show yet.</Text>
      </Box>
    );
  }

  return (
    <Stack as="ul" gap={3}>
      {spells.map((spell) => (
        <SpellListItem
          key={spell.index}
          spell={spell}
          onOpenDetails={() => onOpenDetails(spell)}
        />
      ))}
    </Stack>
  );
}
