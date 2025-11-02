import { Card, Group, Text, Badge, Button, Stack } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { notifications } from '@mantine/notifications';

type Props = {
  spell: Spell;
  onOpenDetails: () => void;
  onCast?: (spell: Spell) => void;
};

export function PreparedSpellListItem({ spell, onOpenDetails, onCast }: Props) {
  const school = spell.school_name;

  const handleCast = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCast) {
      onCast(spell);
    } else {
      notifications.show({
        title: 'Cast spell',
        message: `"${spell.name}" cast initiated.`,
      });
    }
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
        </Stack>

        <Group gap="xs">
          <Button size="xs" variant="light" onClick={handleCast}>
            Cast spell
          </Button>
          <Badge variant="light">
            {spell.level === 0 ? 'cantrip' : `Level ${spell.level}`}
          </Badge>
        </Group>
      </Group>
    </Card>
  );
}
