import {
  Card,
  Group,
  Text,
  Badge,
  Button,
  Stack,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { Trash2 } from 'lucide-react';
import type { Spell } from '../../types/spells';
import { preparedLevelLabel } from '../../constants/dnd';
import { useRemoveKnownSpell } from '../../hooks/useCharacters';

type Props = {
  characterId: string;
  spell: Spell;
  onOpenDetails: () => void;
  onCast: (spell: Spell) => void;
  isSorcerer?: boolean;
};

export function PreparedSpellListItem({
  characterId,
  spell,
  onOpenDetails,
  onCast,
  isSorcerer = false,
}: Props) {
  const school = spell.school_name;
  const removeKnownSpell = useRemoveKnownSpell();

  const handleCast = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCast(spell);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isSorcerer) return;

    removeKnownSpell.mutate({
      characterId,
      spellId: String(spell.id),
    });
  };

  return (
    <Card
      component="li"
      withBorder
      padding="sm"
      radius="md"
      onClick={onOpenDetails}
      style={{ cursor: 'pointer' }}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap={2} maw="80%">
          <Text fw={500}>{spell.name}</Text>

          {school ? (
            <Text fz="xs" c="dimmed">
              {school}
            </Text>
          ) : null}

          {spell.concentration ? (
            <Text fz="xs" c="dimmed">
              Concentration
              {spell.duration ? ` ${String(spell.duration).toLowerCase()}` : ''}
            </Text>
          ) : null}

          <Group gap="xs">
            <Button size="xs" variant="light" color="red" onClick={handleCast}>
              Cast spell
            </Button>
          </Group>
        </Stack>

        <Stack align="flex-end">
          <Badge variant="light">{preparedLevelLabel[spell.level].name}</Badge>

          {isSorcerer ? (
            <Tooltip label="Remove">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={handleRemove}
                loading={removeKnownSpell.isPending}
                disabled={removeKnownSpell.isPending}
              >
                <Trash2 size={16} />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </Stack>
      </Group>
    </Card>
  );
}
