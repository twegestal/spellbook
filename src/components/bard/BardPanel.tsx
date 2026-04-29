import {
  Stack,
  Paper,
  Text,
  Group,
  Badge,
  SimpleGrid,
  Center,
  Loader,
} from '@mantine/core';
import { useEffect } from 'react';
import {
  useResources,
  useSpendResource,
  useRestoreResource,
  useSetResource,
} from '../../hooks/useResources';
import { ResourceCard } from '../shared/ResourceCard';

type Props = {
  characterId: string;
  characterLevel: number;
};

function getBardicInspirationDie(level: number): string {
  if (level >= 15) return 'd12';
  if (level >= 10) return 'd10';
  if (level >= 5) return 'd8';
  return 'd6';
}

function getBardicInspirationReset(level: number): 'short' | 'long' {
  return level >= 5 ? 'short' : 'long';
}

export function BardPanel({ characterId, characterLevel }: Props) {
  const { data: resources, isLoading } = useResources(characterId);
  const spend = useSpendResource(characterId);
  const restore = useRestoreResource(characterId);
  const setResource = useSetResource(characterId);

  const bardicInspiration = resources?.find(
    (r) => r.key === 'bardic_inspiration',
  );
  const chaModifier = resources?.find((r) => r.key === 'cha_modifier');

  const die = getBardicInspirationDie(characterLevel);
  const resetsOn = getBardicInspirationReset(characterLevel);
  const bardicMax = chaModifier?.current ?? 3;

  useEffect(() => {
    if (!resources) return;

    const keys = resources.map((r) => r.key);

    if (!keys.includes('cha_modifier')) {
      setResource.mutate({
        key: 'cha_modifier',
        maximum: 3,
        resets_on: 'long',
      });
    }
  }, [resources]);

  useEffect(() => {
    if (!resources || !chaModifier) return;

    const needsUpdate =
      !bardicInspiration ||
      bardicInspiration.maximum !== bardicMax ||
      bardicInspiration.resets_on !== resetsOn;

    if (needsUpdate) {
      setResource.mutate({
        key: 'bardic_inspiration',
        maximum: bardicMax,
        resets_on: resetsOn,
      });
    }
  }, [chaModifier?.current, characterLevel]);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>Charisma modifier</Text>
          <Badge variant="filled" color="blue">
            {chaModifier?.current !== undefined
              ? chaModifier.current >= 0
                ? `+${chaModifier.current}`
                : chaModifier.current
              : '?'}
          </Badge>
        </Group>
        <Text fz="sm" c="dimmed" mb="sm">
          Your Bardic Inspiration maximum equals your Charisma modifier. Update
          this if your modifier changes.
        </Text>
        <Group gap="xs">
          {[-1, 0, 1, 2, 3, 4, 5].map((n) => (
            <Badge
              key={n}
              variant={chaModifier?.current === n ? 'filled' : 'outline'}
              color="blue"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setResource.mutate({
                  key: 'cha_modifier',
                  maximum: n,
                  resets_on: 'long',
                })
              }
            >
              {n >= 0 ? `+${n}` : n}
            </Badge>
          ))}
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Text fw={600}>Bardic Inspiration</Text>
          <Badge variant="light" color="blue">
            {die}
          </Badge>
        </Group>
        <Text fz="sm" c="dimmed" mb="md">
          Grant a creature one Bardic Inspiration die ({die}) to add to one
          ability check, attack roll, or saving throw.{' '}
          {characterLevel >= 5
            ? 'Resets on short or long rest.'
            : 'Resets on long rest.'}
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {bardicInspiration && (
            <ResourceCard
              resource={bardicInspiration}
              label="Bardic Inspiration"
              description={`${die} — ${
                bardicInspiration.resets_on === 'short'
                  ? 'short or long rest'
                  : 'long rest'
              }`}
              color="blue"
              onSpend={() => spend.mutate({ key: 'bardic_inspiration' })}
              onRestore={() =>
                restore.mutate({ key: 'bardic_inspiration', qty: 1 })
              }
              isSpending={spend.isPending}
              isRestoring={restore.isPending}
            />
          )}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
