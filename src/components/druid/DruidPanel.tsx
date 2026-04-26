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

function getWildShapeCR(level: number): string {
  if (level >= 8) return 'CR 1';
  if (level >= 4) return 'CR 1/2 (no flying speed)';
  return 'CR 1/4 (no flying or swimming speed)';
}

export function DruidPanel({ characterId, characterLevel }: Props) {
  const { data: resources, isLoading } = useResources(characterId);
  const spend = useSpendResource(characterId);
  const restore = useRestoreResource(characterId);
  const setResource = useSetResource(characterId);

  const wildShape = resources?.find((r) => r.key === 'wild_shape');
  const cr = getWildShapeCR(characterLevel);

  useEffect(() => {
    if (!resources) return;

    if (!resources.find((r) => r.key === 'wild_shape')) {
      setResource.mutate({
        key: 'wild_shape',
        maximum: 2,
        resets_on: 'short',
      });
    }
  }, [resources]);

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
        <Group justify="space-between" mb="sm">
          <Text fw={600}>Wild Shape</Text>
          <Badge variant="light" color="green">
            {cr}
          </Badge>
        </Group>
        <Text fz="sm" c="dimmed" mb="md">
          Magically assume the shape of a beast you have seen before. Maximum CR
          increases with level. Resets on short or long rest.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {wildShape && (
            <ResourceCard
              resource={wildShape}
              label="Wild Shape"
              description={`${cr} — short or long rest`}
              color="green"
              onSpend={() => spend.mutate({ key: 'wild_shape' })}
              onRestore={() => restore.mutate({ key: 'wild_shape', qty: 1 })}
              isSpending={spend.isPending}
              isRestoring={restore.isPending}
            />
          )}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
