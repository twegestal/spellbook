import {
  Paper,
  Group,
  Text,
  Badge,
  Progress,
  Stack,
  SimpleGrid,
  Card,
  Button,
} from '@mantine/core';
import {
  useSorceryPoints,
  useSpendSorceryPoints,
} from '../../hooks/useSorceryPoints';
import { useMetamagic } from '../../hooks/useMetamagic';

type Props = {
  characterId: string;
};

export function MetamagicPanel({ characterId }: Props) {
  const sp = useSorceryPoints(characterId);
  const spend = useSpendSorceryPoints(characterId);
  const { data: metamagic, isLoading: metaLoading } = useMetamagic();

  const remaining = Math.max(0, Number(sp.data?.remaining ?? 0));
  const maximum = Math.max(remaining, Number(sp.data?.maximum ?? 0));
  const pct = maximum > 0 ? Math.min(100, (remaining / maximum) * 100) : 0;

  const handleSpend = (amount: number) => {
    if (amount <= 0 || amount > remaining) return;
    spend.mutate({ qty: amount });
  };

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Text fw={600}>Sorcery points</Text>
          <Badge variant={remaining === 0 ? 'outline' : 'light'} color="grape">
            {sp.isLoading ? '—/—' : `${remaining}/${maximum}`}
          </Badge>
        </Group>

        <Progress
          value={sp.isLoading ? 0 : pct}
          size="sm"
          radius="xl"
          animated={sp.isFetching}
        />
        <Text size="xs" c="dimmed" mt={6}>
          {sp.isLoading ? 'Loading…' : `${remaining} of ${maximum} remaining`}
        </Text>
      </Paper>

      {/* Metamagic options */}
      <Paper withBorder radius="md" p="md">
        <Text fw={600} mb="sm">
          Metamagic
        </Text>

        {metaLoading || !metamagic?.length ? (
          <Text c="dimmed" size="sm">
            {metaLoading ? 'Loading metamagic…' : 'No metamagic options.'}
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {metamagic.map((m) => {
              const canAfford = remaining >= m.cost && !spend.isPending;
              return (
                <Card key={m.id} withBorder radius="md" p="md">
                  <Group justify="space-between" mb={4} align="start">
                    <Text fw={600}>{m.name}</Text>
                    <Badge variant="light" color="grape">
                      {m.cost} SP
                    </Badge>
                  </Group>
                  {m.description && (
                    <Text size="sm" c="dimmed" mb="sm">
                      {m.description}
                    </Text>
                  )}
                  <Group justify="end">
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => handleSpend(m.cost)}
                      disabled={!canAfford}
                      loading={spend.isPending}
                    >
                      Spend {m.cost} SP
                    </Button>
                  </Group>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Paper>
    </Stack>
  );
}
