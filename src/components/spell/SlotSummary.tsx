import { Box, Grid, Text } from '@chakra-ui/react';
import type { SpellSlots } from '../../hooks/useSpellSlots';

type Props = {
  slots: SpellSlots | null | undefined;
};

export function SlotSummary({ slots }: Props) {
  if (!slots) {
    return (
      <Box>
        <Text fontWeight="semibold">Spell Slots</Text>
        <Text fontSize="sm" opacity={0.8}>
          —
        </Text>
      </Box>
    );
  }

  if (slots.kind === 'pact') {
    return (
      <Box>
        <Text fontWeight="semibold">Pact (Lvl {slots.slotLevel})</Text>
        <Text fontSize="sm">
          {slots.remaining} / {slots.maximum}
        </Text>
      </Box>
    );
  }

  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <Box>
      <Grid templateColumns="repeat(10, auto)" gap={3} alignItems="center">
        <Text fontWeight="semibold">Level</Text>
        {levels.map((lvl) => (
          <Text key={`L-${lvl}`} fontWeight="semibold">
            {lvl}
          </Text>
        ))}
      </Grid>

      <Grid templateColumns="repeat(10, auto)" gap={3} alignItems="center">
        <Text fontWeight="semibold">Slots</Text>
        {levels.map((lvl) => {
          const row = slots.byLevel[lvl];
          const remaining = row?.remaining ?? 0;
          return (
            <Text key={`R-${lvl}`} fontSize="sm">
              {remaining}
            </Text>
          );
        })}
      </Grid>
    </Box>
  );
}
