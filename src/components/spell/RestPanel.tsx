import {
  Card,
  Group,
  Text,
  SimpleGrid,
  Progress,
  Badge,
  Stack,
  Skeleton,
  Paper,
} from '@mantine/core';
import { FlameKindling, BedDouble } from 'lucide-react';
import classes from '../../styles/RestPanel.module.css';

import type {
  SpellSlots,
  SpellSlotsPrepared,
  SpellSlotsPact,
} from '../../hooks/useSpellSlots';

type Props = {
  longRestClickable: boolean;
  onLongRest: () => void;
  onShortRest?: () => void;
  slots?: SpellSlots;
  slotsLoading?: boolean;
};

type DisplayLevel = {
  label: string;
  remaining: number;
  maximum: number;
  order: number;
};

function toDisplayLevels(slots?: SpellSlots): DisplayLevel[] {
  if (!slots) return [];

  if (slots.kind === 'prepared') {
    const prepared = slots as SpellSlotsPrepared;
    return Object.keys(prepared.byLevel)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
      .map((lvl) => {
        const { remaining, maximum } = prepared.byLevel[lvl]!;
        return { label: `Lv ${lvl}`, remaining, maximum, order: lvl };
      });
  }

  // pact
  const pact = slots as SpellSlotsPact;
  return [
    {
      label: `Lv ${pact.slotLevel}`,
      remaining: pact.remaining,
      maximum: pact.maximum,
      order: pact.slotLevel,
    },
  ];
}

export function RestPanel({
  longRestClickable,
  onLongRest,
  onShortRest,
  slots,
  slotsLoading = false,
}: Props) {
  const levels = toDisplayLevels(slots);

  return (
    <Stack gap="md">
      <Group justify="flex-start" gap="md">
        <Card
          shadow="sm"
          radius="md"
          withBorder
          className={`${classes.tile} ${
            !longRestClickable ? classes.tileDisabled : ''
          }`}
          onClick={() => longRestClickable && onLongRest()}
          aria-disabled={!longRestClickable}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && longRestClickable) onLongRest();
          }}
        >
          <Group align="center" gap="sm" wrap="nowrap">
            <BedDouble size={22} color="var(--mantine-color-red-5)" />
            <Text fw={500}>Long rest</Text>
          </Group>
        </Card>

        <Card
          shadow="sm"
          radius="md"
          withBorder
          className={classes.tile}
          onClick={() => onShortRest?.()}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onShortRest?.()}
        >
          <Group align="center" gap="sm" wrap="nowrap">
            <FlameKindling size={22} color="var(--mantine-color-red-5)" />
            <Text fw={500}>Short rest</Text>
          </Group>
        </Card>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Text fw={600}>Spell slots</Text>
        </Group>

        {slotsLoading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} withBorder radius="md" p="md">
                <Skeleton height={12} width="30%" mb="xs" />
                <Skeleton height={8} />
                <Skeleton height={8} mt="xs" width="70%" />
              </Card>
            ))}
          </SimpleGrid>
        ) : levels.length === 0 ? (
          <Text c="dimmed" size="sm">
            No slot data available.
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {levels.map(({ label, remaining, maximum }) => {
              const pct =
                maximum > 0
                  ? Math.max(0, Math.min(100, (remaining / maximum) * 100))
                  : 0;
              const depleted = maximum === 0 || remaining === 0;

              return (
                <Card key={label} withBorder radius="md" p="md">
                  <Group justify="space-between" mb={6}>
                    <Text fw={600}>{label}</Text>
                    <Badge variant="light" color={depleted ? 'gray' : 'red'}>
                      {remaining}/{maximum}
                    </Badge>
                  </Group>
                  <Progress
                    value={pct}
                    size="sm"
                    radius="xl"
                    striped={remaining > 0 && remaining < maximum}
                    transitionDuration={150}
                  />
                  <Text size="xs" c="dimmed" mt={6}>
                    {remaining} of {maximum} remaining
                  </Text>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Paper>
    </Stack>
  );
}
