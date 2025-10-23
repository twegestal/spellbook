import { useCallback, useMemo, useState } from 'react';
import { Stack, Box, Text, Separator, HStack } from '@chakra-ui/react';
import type { Spell } from '../../types/spells';
import { PreparedSpellListItem } from './PreparedSpellListItem';
import { useSpellSlots } from '../../hooks/useSpellSlots';
import { useToggleSpellSlot } from '../../hooks/useToggleSpellSlot';
import { MagnifiedSlotPicker } from './MagnifiedSlotPicker';
import { Dot } from './Dot';

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

  const [zoom, setZoom] = useState<null | { lvl: number }>(null);
  const closeZoom = useCallback(() => setZoom(null), []);

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
            const isSpent = i < spent;
            return (
              <Dot key={i} isSpent={isSpent} onClick={() => setZoom({ lvl })} />
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
          const isSpent = i < spent;
          return (
            <Dot key={i} isSpent={isSpent} onClick={() => setZoom({ lvl })} />
          );
        })}
      </HStack>
    );
  };

  const zoomData = useMemo(() => {
    if (!zoom || !slots) return null;

    if (slots.kind === 'pact') {
      if (zoom.lvl !== slots.slotLevel) return null;
      const maximum = slots.maximum;
      const spent = maximum - slots.remaining;

      return {
        levelLabel: `Pact Slots (Lvl ${slots.slotLevel})`,
        maximum,
        spent,
        onToggle: (slotIndex: number) =>
          toggle.mutate({
            characterId,
            slotLevel: zoom.lvl,
            slotIndex,
          }),
      };
    }

    const row = slots.byLevel[zoom.lvl];
    if (!row) return null;

    const maximum = row.maximum;
    const spent = maximum - row.remaining;

    return {
      levelLabel: `Level ${zoom.lvl}`,
      maximum,
      spent,
      onToggle: (slotIndex: number) =>
        toggle.mutate({
          characterId,
          slotLevel: zoom.lvl,
          slotIndex,
        }),
    };
  }, [zoom, slots, toggle, characterId]);

  return (
    <>
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
                color="whiteAlpha.800"
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
                    key={spell.id}
                    spell={spell}
                    onOpenDetails={() => onOpenDetails(spell)}
                    onCast={onCast}
                  />
                ))}
            </Stack>

            {i < sortedLevels.length - 1 && (
              <Separator my={4} borderColor="whiteAlpha.200" />
            )}
          </Box>
        ))}
      </Stack>

      {zoomData && (
        <MagnifiedSlotPicker
          characterId={characterId}
          isOpen={!!zoom}
          onClose={closeZoom}
          levelLabel={zoomData.levelLabel}
          maximum={zoomData.maximum}
          spent={zoomData.spent}
          onToggle={zoomData.onToggle}
        />
      )}
    </>
  );
}
