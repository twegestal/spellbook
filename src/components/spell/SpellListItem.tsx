import { Card, Group, Badge, Text, ActionIcon, Stack } from '@mantine/core';
import { PlusCircle } from 'lucide-react';
import type { Spell } from '../../types/spells';
import { openAssignSpellModal } from '../overlays/openAssignSpellModal';

type Props = {
  spell: Spell;
  onOpenDetails: () => void;
};

export function SpellListItem({ spell, onOpenDetails }: Props) {
  const levelLabel = spell.level === 0 ? 'cantrip' : `Level ${spell.level}`;

  const spellType = (spell: Spell) => {
    return spell.damage_type_id != null ? 'Damage' : 'Utility';
  };
  return (
    <Card
      withBorder
      radius="md"
      padding="sm"
      onClick={onOpenDetails}
      style={{ cursor: 'pointer' }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Stack>
          <Group gap="sm">
            <ActionIcon
              variant="outline"
              aria-label={`Add ${spell.name}`}
              onClick={(e) => {
                e.stopPropagation();
                openAssignSpellModal(spell);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
              }}
            >
              <PlusCircle size={18} />
            </ActionIcon>

            <Text>{spell.name}</Text>
          </Group>
          <Badge color="gray" variant="light">
            {spellType(spell)}
          </Badge>
        </Stack>

        <Badge variant="light">{levelLabel}</Badge>
      </Group>
    </Card>
  );
}
