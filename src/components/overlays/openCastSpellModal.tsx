import { modals } from '@mantine/modals';
import { Box, Button, Group, Stack, Text, Badge } from '@mantine/core';
import type { Spell } from '../../types/spells';

type CastOption = {
  level: number;
  remaining: number;
  maximum: number;
  nextIndex: number;
};

function buildCastOptions(slots: any, spellLevel: number): CastOption[] {
  if (!slots) return [];

  if (slots.kind === 'pact') {
    const { slotLevel, remaining, maximum } = slots;
    if (remaining > 0) {
      const spent = maximum - remaining;
      return [{ level: slotLevel, remaining, maximum, nextIndex: spent + 1 }];
    }
    return [];
  }

  if (slots.kind === 'multiclass') {
    const options: CastOption[] = [];

    if (slots.pact.remaining > 0) {
      const { slotLevel, remaining, maximum } = slots.pact;
      const spent = maximum - remaining;
      options.push({
        level: slotLevel,
        remaining,
        maximum,
        nextIndex: spent + 1,
      });
    }

    // Vanliga slots — bara om spell level matchar
    const byLevel = slots.byLevel ?? {};
    const levels = Object.keys(byLevel)
      .map(Number)
      .filter((lvl) => lvl >= spellLevel)
      .sort((a, b) => a - b);

    for (const lvl of levels) {
      const row = byLevel[lvl];
      if (row?.remaining > 0) {
        const spent = row.maximum - row.remaining;
        options.push({
          level: lvl,
          remaining: row.remaining,
          maximum: row.maximum,
          nextIndex: spent + 1,
        });
      }
    }

    return options;
  }

  // prepared
  const byLevel =
    slots.byLevel ??
    Object.fromEntries(
      (slots.levels ?? []).map((r: any) => [
        r.slotLevel,
        { maximum: r.maximum, remaining: r.remaining },
      ]),
    );

  const levels = Object.keys(byLevel)
    .map(Number)
    .filter((lvl) => lvl >= spellLevel)
    .sort((a, b) => a - b);

  const options: CastOption[] = [];
  for (const lvl of levels) {
    const row = byLevel[lvl];
    if (!row) continue;
    if (row.remaining > 0) {
      const spent = row.maximum - row.remaining;
      options.push({
        level: lvl,
        remaining: row.remaining,
        maximum: row.maximum,
        nextIndex: spent + 1,
      });
    }
  }
  return options;
}

export function openCastSpellModal(params: {
  spell: Spell;
  slots: any;
  onPick: (slotLevel: number, slotIndex: number) => void;
}) {
  const { spell, slots, onPick } = params;
  const spellLevel = spell.level ?? 0;

  if (spellLevel === 0) {
    onPick(0, 0);
    return;
  }

  const options = buildCastOptions(slots, spellLevel);

  const id = modals.open({
    centered: true,
    withCloseButton: true,
    title: `Cast ${spell.name}`,
    children: (
      <Stack gap="md">
        {options.length === 0 ? (
          <Text c="red" fz="sm">
            No available slots at level {spellLevel} or higher.
          </Text>
        ) : (
          <Stack gap="xs">
            {options.map((opt) => (
              <Button
                key={opt.level}
                variant="outline"
                fullWidth
                onClick={() => {
                  onPick(opt.level, opt.nextIndex);
                  modals.close(id);
                }}
              >
                <Group justify="space-between" w="100%" wrap="nowrap">
                  <Text>Level {opt.level}</Text>
                  <Box>
                    <Badge variant="light">
                      {opt.remaining}/{opt.maximum} remaining
                    </Badge>
                  </Box>
                </Group>
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    ),
  });
}
