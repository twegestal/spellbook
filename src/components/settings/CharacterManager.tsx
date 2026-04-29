import { Stack, Text, Divider, Group, Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  useAllCharacters,
  useRetireCharacter,
  useRestoreCharacter,
} from '../../hooks/useCharacters';

export function CharacterManager() {
  const { data: characters } = useAllCharacters();
  const retire = useRetireCharacter();
  const restore = useRestoreCharacter();

  const active = characters?.filter((c) => !c.is_retired) ?? [];
  const retired = characters?.filter((c) => c.is_retired) ?? [];

  const handleRetire = (character: { id: string; name: string }) => {
    modals.openConfirmModal({
      title: 'Retire character',
      centered: true,
      children: (
        <Text fz="sm">
          Are you sure you want to retire <strong>{character.name}</strong>?
          They will no longer appear in your character list.
        </Text>
      ),
      labels: { confirm: 'Retire', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        retire.mutate(
          { characterId: character.id },
          {
            onSuccess: () =>
              notifications.show({
                color: 'teal',
                message: `${character.name} has been retired.`,
              }),
            onError: (err: any) =>
              notifications.show({
                color: 'red',
                message: err?.message ?? 'Failed to retire character.',
              }),
          },
        );
      },
    });
  };

  const handleRestore = (character: { id: string; name: string }) => {
    restore.mutate(
      { characterId: character.id },
      {
        onSuccess: () =>
          notifications.show({
            color: 'teal',
            message: `${character.name} has been restored!`,
          }),
        onError: (err: any) =>
          notifications.show({
            color: 'red',
            message: err?.message ?? 'Failed to restore character.',
          }),
      },
    );
  };

  return (
    <Stack gap="xs">
      <Text fw={600}>Characters</Text>
      <Text c="dimmed" fz="sm">
        Retire characters you no longer play.
      </Text>
      <Divider my="sm" />

      {active.length === 0 && (
        <Text fz="sm" c="dimmed">
          No active characters.
        </Text>
      )}

      <Stack gap="xs">
        {active.map((c) => (
          <Group key={c.id} justify="space-between">
            <Stack gap={2}>
              <Text fz="sm" fw={500}>
                {c.name}
              </Text>
              <Text fz="xs" c="dimmed">
                {c.classes.map((cl) => `${cl.name} ${cl.level}`).join(' / ')} •{' '}
                {c.race}
              </Text>
            </Stack>
            <Button
              size="compact-sm"
              variant="subtle"
              color="red"
              onClick={() => handleRetire(c)}
              loading={retire.isPending}
            >
              Retire
            </Button>
          </Group>
        ))}
      </Stack>

      {retired.length > 0 && (
        <>
          <Divider my="sm" label="Retired" labelPosition="left" />
          <Stack gap="xs">
            {retired.map((c) => (
              <Group key={c.id} justify="space-between">
                <Stack gap={2}>
                  <Text fz="sm" fw={500} c="dimmed">
                    {c.name}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    {c.classes
                      .map((cl) => `${cl.name} ${cl.level}`)
                      .join(' / ')}{' '}
                    • {c.race}
                  </Text>
                </Stack>
                <Button
                  size="compact-sm"
                  variant="subtle"
                  color="teal"
                  onClick={() => handleRestore(c)}
                  loading={restore.isPending}
                >
                  Restore
                </Button>
              </Group>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}
