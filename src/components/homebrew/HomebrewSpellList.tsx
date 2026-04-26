import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Pencil, Trash2 } from 'lucide-react';
import type { Spell } from '../../types/spells';
import {
  useDeleteHomebrewSpell,
  useTogglePublishSpell,
} from '../../hooks/useHomebrewSpells';

type Props = {
  spells: Spell[];
  onEdit: (spell: Spell) => void;
};

function HomebrewSpellCard({
  spell,
  onEdit,
}: {
  spell: Spell;
  onEdit: () => void;
}) {
  const togglePublish = useTogglePublishSpell();
  const deleteSpell = useDeleteHomebrewSpell();

  const levelLabel = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Delete spell',
      centered: true,
      children: (
        <Text fz="sm">
          Are you sure you want to delete <strong>{spell.name}</strong>? This
          cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteSpell.mutateAsync(spell.id);
          notifications.show({ message: 'Spell deleted', color: 'green' });
        } catch {
          notifications.show({
            message: 'Failed to delete spell',
            color: 'red',
          });
        }
      },
    });
  };

  const handleTogglePublish = async () => {
    try {
      await togglePublish.mutateAsync(spell.id);
      notifications.show({
        message: spell.is_published ? 'Spell unpublished' : 'Spell published!',
        color: 'green',
      });
    } catch {
      notifications.show({ message: 'Failed to update spell', color: 'red' });
    }
  };

  return (
    <Paper withBorder p="sm">
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={4}>
          <Group gap="xs">
            <Text fw={600}>{spell.name}</Text>
            <Badge variant="light" size="sm">
              {levelLabel}
            </Badge>
            {spell.school_name && (
              <Badge variant="light" color="teal" size="sm">
                {spell.school_name}
              </Badge>
            )}
            {spell.concentration && (
              <Badge variant="light" color="red" size="sm">
                Concentration
              </Badge>
            )}
            {spell.ritual && (
              <Badge variant="light" color="cyan" size="sm">
                Ritual
              </Badge>
            )}
          </Group>
          <Text fz="xs" c="dimmed" lineClamp={1}>
            {spell.description?.[0] ?? '—'}
          </Text>
        </Stack>

        <Group gap="sm" wrap="nowrap">
          <Tooltip
            label={
              spell.is_published
                ? 'Published — visible to all'
                : 'Private — only you'
            }
          >
            <Switch
              checked={spell.is_published}
              onChange={handleTogglePublish}
              disabled={togglePublish.isPending}
              size="sm"
              label={spell.is_published ? 'Published' : 'Private'}
            />
          </Tooltip>

          <Tooltip label="Edit">
            <ActionIcon variant="subtle" onClick={onEdit}>
              <Pencil size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={handleDelete}
              loading={deleteSpell.isPending}
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
}

export function HomebrewSpellList({ spells, onEdit }: Props) {
  return (
    <Stack gap="sm">
      {spells.map((spell) => (
        <HomebrewSpellCard
          key={spell.id}
          spell={spell}
          onEdit={() => onEdit(spell)}
        />
      ))}
    </Stack>
  );
}
