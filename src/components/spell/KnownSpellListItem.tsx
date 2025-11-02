import { Card, Group, Text, Badge, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { Spell } from '../../types/spells';
import {
  useAddPreparedSpell,
  useRemovePreparedSpell,
} from '../../hooks/useCharacters';

type Props = {
  characterId: string;
  spell: Spell;
  isPrepared: boolean;
  onOpenDetails: () => void;
};

export function KnownSpellListItem({
  characterId,
  spell,
  isPrepared,
  onOpenDetails,
}: Props) {
  const add = useAddPreparedSpell();
  const remove = useRemovePreparedSpell();
  const busy = add.isPending || remove.isPending;

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (busy) return;

    try {
      if (isPrepared) {
        await remove.mutateAsync({ characterId, spellId: String(spell.id) });
      } else {
        await add.mutateAsync({
          characterId,
          spellId: String(spell.id),
          spell,
        });
      }
    } catch {
      notifications.show({
        color: 'red',
        title: isPrepared
          ? 'Could not unprepare spell'
          : 'Could not prepare spell',
        message: 'Please try again.',
      });
    }
  };

  return (
    <Card
      component="li"
      withBorder
      padding="sm"
      radius="md"
      onClick={() => !busy && onOpenDetails()}
      style={{
        cursor: busy ? 'not-allowed' : 'pointer',
        opacity: busy ? 0.7 : 1,
      }}
    >
      <Group justify="space-between" align="center">
        <Text fw={500}>{spell.name}</Text>

        <Group gap="xs">
          <Button
            size="xs"
            variant={isPrepared ? 'light' : 'default'}
            onClick={handleToggle}
            disabled={busy}
          >
            {isPrepared ? 'Prepared' : 'Prepare'}
          </Button>

          <Badge variant="light">
            {spell.level === 0 ? 'cantrip' : `Level ${spell.level}`}
          </Badge>
        </Group>
      </Group>
    </Card>
  );
}
