import { useCallback, useMemo, useState } from 'react';
import { Stack, Text, Divider, Group } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { PreparedSpellListItem } from './PreparedSpellListItem';
import { useSpellSlots } from '../../hooks/useSpellSlots';
import { useToggleSpellSlot } from '../../hooks/useToggleSpellSlot';
import { MagnifiedSlotPicker } from './MagnifiedSlotPicker';
import { SlotDot } from './SlotDot';
import { notifications } from '@mantine/notifications';
import { openCastSpellModal } from '../overlays/openCastSpellModal';

type Props = {
  characterId: string;
  spells: Spell[];
  onOpenDetails: (spell: Spell) => void;
};

export function PreparedSpellList({
  characterId,
  spells,
  onOpenDetails,
}: Props) {
  const { data: slots } = useSpellSlots(characterId);
  const toggle = useToggleSpellSlot();
  const isBusy = toggle.isPending;

  const [zoom, setZoom] = useState<null | { lvl: number }>(null);
  const closeZoom = useCallback(() => setZoom(null), []);

  if (!spells.length) {
    return (
      <Group justify="center" py="xl">
        <Text c="dimmed">No spells to show yet.</Text>
      </Group>
    );
  }

  const handleCast = (spell: Spell) => {
    if (!slots) {
      notifications.show({
        color: 'red',
        title: 'No slot data',
        message: 'Spell slots not loaded yet.',
      });
      return;
    }

    openCastSpellModal({
      spell,
      slots,
      onPick: (slotLevel, slotIndex) => {
        if (slotLevel === 0) return;

        if (isBusy) return;
        toggle.mutate(
          { characterId, slotLevel, slotIndex },
          {
            onError: (err: any) => {
              notifications.show({
                color: 'red',
                title: 'Failed to spend slot',
                message: err?.message ?? 'Please try again.',
              });
            },
            onSuccess: () => {
              notifications.show({
                color: 'teal',
                title: 'Spell cast',
                message: `Spent a level ${slotLevel} slot for ${spell.name}.`,
              });
            },
          }
        );
      },
    });
  };

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
        <Group gap={4}>
          {Array.from({ length: max }, (_, i) => {
            const isSpent = i < spent;
            return (
              <SlotDot
                key={i}
                isSpent={isSpent}
                disabled={isBusy}
                onClick={() => {
                  if (!isBusy) setZoom({ lvl });
                }}
              />
            );
          })}
        </Group>
      );
    }

    const row = slots.byLevel[lvl];
    if (!row) return null;
    const max = row.maximum;
    const spent = max - row.remaining;

    return (
      <Group gap={4}>
        {Array.from({ length: max }, (_, i) => {
          const isSpent = i < spent;
          return (
            <SlotDot
              key={i}
              isSpent={isSpent}
              disabled={isBusy}
              onClick={() => {
                if (!isBusy) setZoom({ lvl });
              }}
            />
          );
        })}
      </Group>
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
        onToggle: (slotIndex: number) => {
          if (isBusy) return;
          toggle.mutate({ characterId, slotLevel: zoom.lvl, slotIndex });
        },
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
      onToggle: (slotIndex: number) => {
        if (isBusy) return;
        toggle.mutate({ characterId, slotLevel: zoom.lvl, slotIndex });
      },
    };
  }, [zoom, slots, toggle, characterId]);

  return (
    <>
      <Stack
        component="ul"
        gap="md"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {sortedLevels.map((lvl, i) => (
          <Stack key={lvl} gap="xs">
            <Group justify="space-between" align="center">
              <Text fz="xs" tt="uppercase" c="dimmed" fw={600}>
                {lvl === 0 ? 'Cantrips' : `Level ${lvl}`}
              </Text>
              {renderDots(lvl)}
            </Group>

            <Stack gap="sm">
              {groups[lvl]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((spell) => (
                  <PreparedSpellListItem
                    key={spell.id}
                    spell={spell}
                    onOpenDetails={() => onOpenDetails(spell)}
                    onCast={() => handleCast(spell)}
                  />
                ))}
            </Stack>

            {i < sortedLevels.length - 1 && <Divider />}
          </Stack>
        ))}
      </Stack>

      {zoomData && (
        <MagnifiedSlotPicker
          isOpen
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
