import { Card, Group, Text, Badge, Button } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { notifications } from '@mantine/notifications';
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
  const { mutateAsync: addAsync, isPending: adding } = useAddPreparedSpell();
  const { mutateAsync: removeAsync, isPending: removing } =
    useRemovePreparedSpell();

  const busy = adding || removing;
  const spellId = String(spell.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (busy) return;
    try {
      if (isPrepared) {
        await removeAsync({ characterId, spellId });
        notifications.show({
          title: 'Spell unprepared',
          message: `"${spell.name}" removed from prepared spells.`,
        });
      } else {
        await addAsync({ characterId, spellId });
        notifications.show({
          title: 'Spell prepared',
          message: `"${spell.name}" is now prepared.`,
        });
      }
    } catch (err: any) {
      notifications.show({
        color: 'red',
        title: 'Action failed',
        message: err?.message ?? 'Please try again.',
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
