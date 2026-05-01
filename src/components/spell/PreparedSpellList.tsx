import { useCallback, useMemo, useState } from 'react';
import { Stack, Text, Group } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { PreparedSpellListItem } from './PreparedSpellListItem';
import { useSpellSlots } from '../../hooks/useSpellSlots';
import { useToggleSpellSlot } from '../../hooks/useToggleSpellSlot';
import { MagnifiedSlotPicker } from './MagnifiedSlotPicker';
import { SlotDot } from './SlotDot';
import { notifications } from '@mantine/notifications';
import { openCastSpellModal } from '../overlays/openCastSpellModal';
import { spawnDamageBlast } from '../animations/spawnDamageBlast';
import type { DamageType } from '../animations/DamageExplosion';

type Props = {
  characterId: string;
  spells: Spell[];
  onOpenDetails: (spell: Spell) => void;
  isSorcerer?: boolean;
};

type ZoomTarget = { lvl: number; isPact: boolean };

export function PreparedSpellList({
  characterId,
  spells,
  onOpenDetails,
  isSorcerer = false,
}: Props) {
  const { data: slots } = useSpellSlots(characterId);
  const toggle = useToggleSpellSlot();
  const isBusy = toggle.isPending;

  const [zoom, setZoom] = useState<ZoomTarget | null>(null);
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
        if (slotLevel === 0) {
          const damage = spell.damage_type_name?.toLowerCase?.();
          if (damage) spawnDamageBlast(damage as DamageType);
          return;
        }
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
              const damage = spell.damage_type_name?.toLowerCase?.();
              if (damage) spawnDamageBlast(damage as DamageType);
            },
          },
        );
      },
    });
  };

  const groups = spells.reduce(
    (acc, spell) => {
      const lvl = spell.level ?? 0;
      if (!acc[lvl]) acc[lvl] = [];
      acc[lvl].push(spell);
      return acc;
    },
    {} as Record<number, Spell[]>,
  );

  const sortedLevels = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);

  const renderRegularDots = (lvl: number) => {
    if (!slots || lvl === 0) return null;

    if (slots.kind === 'pact') {
      if (lvl !== slots.slotLevel) return null;
      const max = slots.maximum;
      const spent = max - slots.remaining;
      return (
        <Group gap={4}>
          {Array.from({ length: max }, (_, i) => (
            <SlotDot
              key={i}
              isSpent={i < spent}
              disabled={isBusy}
              onClick={() => {
                if (!isBusy) setZoom({ lvl, isPact: false });
              }}
            />
          ))}
        </Group>
      );
    }

    if (slots.kind === 'multiclass') {
      const row = slots.byLevel[lvl];
      if (!row) return null;
      const spent = row.maximum - row.remaining;
      return (
        <Group gap={4}>
          {Array.from({ length: row.maximum }, (_, i) => (
            <SlotDot
              key={i}
              isSpent={i < spent}
              disabled={isBusy}
              onClick={() => {
                if (!isBusy) setZoom({ lvl, isPact: false });
              }}
            />
          ))}
        </Group>
      );
    }

    const row = slots.byLevel[lvl];
    if (!row) return null;
    const spent = row.maximum - row.remaining;
    return (
      <Group gap={4}>
        {Array.from({ length: row.maximum }, (_, i) => (
          <SlotDot
            key={i}
            isSpent={i < spent}
            disabled={isBusy}
            onClick={() => {
              if (!isBusy) setZoom({ lvl, isPact: false });
            }}
          />
        ))}
      </Group>
    );
  };

  const renderPactDots = () => {
    if (slots?.kind !== 'multiclass') return null;
    const { slotLevel, maximum, remaining } = slots.pact;
    const spent = maximum - remaining;
    return (
      <Group gap={4}>
        {Array.from({ length: maximum }, (_, i) => (
          <SlotDot
            key={i}
            isSpent={i < spent}
            disabled={isBusy}
            color="violet"
            onClick={() => {
              if (!isBusy) setZoom({ lvl: slotLevel, isPact: true });
            }}
          />
        ))}
      </Group>
    );
  };

  const zoomData = useMemo(() => {
    if (!zoom || !slots) return null;

    if (slots.kind === 'pact') {
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

    if (slots.kind === 'multiclass') {
      if (zoom.isPact) {
        const maximum = slots.pact.maximum;
        const spent = maximum - slots.pact.remaining;
        return {
          levelLabel: `Pact Slots (Lvl ${slots.pact.slotLevel})`,
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
  }, [zoom, slots, toggle, characterId, isBusy]);

  // Visa pact-raden överst om multiclass
  const showPactRow = slots?.kind === 'multiclass';
  const pactSlotLevel =
    slots?.kind === 'multiclass' ? slots.pact.slotLevel : null;

  return (
    <>
      <Stack
        component="ul"
        gap="md"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {/* Separat rad för pact slots vid multiclass */}
        {showPactRow && (
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Text fz="xs" tt="uppercase" c="violet" fw={600}>
                Pact Magic (Lvl {pactSlotLevel})
              </Text>
              {renderPactDots()}
            </Group>
          </Stack>
        )}

        {sortedLevels.map((lvl) => (
          <Stack key={lvl} gap="xs">
            <Group justify="space-between" align="center">
              <Text fz="xs" tt="uppercase" c="dimmed" fw={600}>
                {lvl === 0 ? 'Cantrips' : `Level ${lvl}`}
              </Text>
              {renderRegularDots(lvl)}
            </Group>

            <Stack gap="sm">
              {groups[lvl]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((spell) => (
                  <PreparedSpellListItem
                    key={spell.id}
                    characterId={characterId}
                    spell={spell}
                    isSorcerer={isSorcerer}
                    onOpenDetails={() => onOpenDetails(spell)}
                    onCast={() => handleCast(spell)}
                  />
                ))}
            </Stack>
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
