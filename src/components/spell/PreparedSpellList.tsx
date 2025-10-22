import { Stack, Box, Text, Separator, HStack } from '@chakra-ui/react';
import type { Spell } from '../../types/spells';
import { PreparedSpellListItem } from './PreparedSpellListItem';
import { useSpellSlots } from '../../hooks/useSpellSlots';
import { useToggleSpellSlot } from '../../hooks/useToggleSpellSlot';

type Props = {
  characterId: string;
  spells: Spell[];
  onOpenDetails: (spell: Spell) => void;
  onCast?: (spell: Spell) => void;
};

export function PreparedSpellList({
  characterId,
  spells,
  onOpenDetails,
  onCast,
}: Props) {
  const { data: slots } = useSpellSlots(characterId);
  const toggle = useToggleSpellSlot();

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

  const renderDots = (lvl: number) => {
    if (!slots || lvl === 0) return null;

    if (slots.kind === 'pact') {
      if (lvl !== slots.slotLevel) return null;
      const max = slots.maximum;
      const spent = max - slots.remaining;
      return (
        <HStack gap={1}>
          {Array.from({ length: max }, (_, i) => {
            const index = i + 1;
            const isSpent = i < spent;
            return (
              <Box
                key={i}
                as="button"
                aria-label={`Toggle slot ${index}`}
                onClick={() =>
                  toggle.mutate({
                    characterId,
                    slotLevel: lvl,
                    slotIndex: index,
                  })
                }
                w="18px"
                h="18px"
                borderRadius="full"
                borderWidth="1px"
                opacity={isSpent ? 1 : 0.6}
                bg={isSpent ? 'fg.muted' : 'transparent'}
              />
            );
          })}
        </HStack>
      );
    }

    const row = slots.byLevel[lvl];
    if (!row) return null;
    const max = row.maximum;
    const spent = max - row.remaining;

    return (
      <HStack gap={1}>
        {Array.from({ length: max }, (_, i) => {
          const index = i + 1;
          const isSpent = i < spent;
          return (
            <Box
              key={i}
              as="button"
              aria-label={`Toggle slot ${index}`}
              onClick={() =>
                toggle.mutate({
                  characterId,
                  slotLevel: lvl,
                  slotIndex: index,
                })
              }
              w="18px"
              h="18px"
              borderRadius="full"
              borderWidth="1px"
              opacity={isSpent ? 1 : 0.6}
              bg={isSpent ? 'fg.muted' : 'transparent'}
            />
          );
        })}
      </HStack>
    );
  };

  return (
    <Stack as="ul" gap={3}>
      {sortedLevels.map((lvl, i) => (
        <Box key={lvl}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Text
              fontWeight="semibold"
              color="fg.muted"
              fontSize="xs"
              textTransform="uppercase"
            >
              {lvl === 0 ? 'Cantrips' : `Level ${lvl}`}
            </Text>

            {renderDots(lvl)}
          </Box>

          <Stack gap={3}>
            {groups[lvl]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((spell) => (
                <PreparedSpellListItem
                  key={spell.index}
                  spell={spell}
                  onOpenDetails={() => onOpenDetails(spell)}
                  onCast={onCast}
                />
              ))}
          </Stack>

          {i < sortedLevels.length - 1 && <Separator my={4} />}
        </Box>
      ))}
    </Stack>
  );
}
