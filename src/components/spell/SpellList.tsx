import { Box, Stack, Text } from '@chakra-ui/react';
import type { Spell } from '@/types/spells';
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

  return (
    <Stack as="ul" gap={3}>
      {spells.map((spell) => (
        <SpellListItem
          key={spell.index}
          spell={spell}
          onOpenDetails={() => onOpenDetails(spell)}
          overlayContainer={overlayContainer}
        />
      ))}
    </Stack>
  );
}
