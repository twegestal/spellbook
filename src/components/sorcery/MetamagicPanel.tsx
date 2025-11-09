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
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import {
  useSorceryPoints,
  useSpendSorceryPoints,
} from '../../hooks/useSorceryPoints';
import { useMetamagic } from '../../hooks/useMetamagic';
import {
  useKnownMetamagic,
  useAddKnownMetamagic,
  useDeleteKnownMetamagic,
  mergeKnownWithCatalog,
} from '../../hooks/useMetamagic';
import { AddMetamagicModal } from './AddMetamagicModal';

type Props = {
  characterId: string;
};

export function MetamagicPanel({ characterId }: Props) {
  const sp = useSorceryPoints(characterId);
  const spend = useSpendSorceryPoints(characterId);

  const remaining = Math.max(0, Number(sp.data?.remaining ?? 0));
  const maximum = Math.max(remaining, Number(sp.data?.maximum ?? 0));
  const pct = maximum > 0 ? Math.min(100, (remaining / maximum) * 100) : 0;

  const { data: catalog, isLoading: catalogLoading } = useMetamagic();
  const { data: knownRows, isLoading: knownLoading } =
    useKnownMetamagic(characterId);

  const addKnown = useAddKnownMetamagic(characterId);
  const delKnown = useDeleteKnownMetamagic(characterId);

  const { knownOptions, availableOptions } = mergeKnownWithCatalog(
    catalog,
    knownRows
  );

  const [addOpen, setAddOpen] = useState(false);

  const handleSpend = (amount: number) => {
    if (amount <= 0 || amount > remaining) return;
    spend.mutate({ qty: amount });
  };

  const handleAdd = (idx: string) => {
    addKnown.mutate({ idx }, { onSuccess: () => setAddOpen(false) });
  };

  const handleRemove = (idx: string) => {
    delKnown.mutate({ idx });
  };

  const loadingAny = sp.isLoading || catalogLoading || knownLoading;

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

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Text fw={600}>Metamagic</Text>
        </Group>

        {loadingAny && !knownOptions.length ? (
          <Text c="dimmed" size="sm">
            Loading metamagic…
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {knownOptions.map((m) => {
              const canAfford = remaining >= m.cost && !spend.isPending;
              return (
                <Card key={m.__idx} withBorder radius="md" p="md">
                  <Group justify="space-between" mb={4} align="start">
                    <Text fw={600}>{m.name}</Text>
                    <Group gap="xs">
                      <Badge variant="light" color="grape">
                        {m.cost} SP
                      </Badge>
                      <Tooltip label="Remove">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleRemove(m.__idx)}
                          disabled={delKnown.isPending}
                          aria-label={`Remove ${m.name}`}
                        >
                          <Trash2 size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
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

            {/* Add new option card */}
            <Card
              withBorder
              radius="md"
              p="md"
              onClick={() => setAddOpen(true)}
              style={{
                cursor: availableOptions.length ? 'pointer' : 'default',
              }}
            >
              <Group justify="center" mih={64}>
                <Group gap="xs" align="center">
                  <Plus size={18} />
                  <Text fw={600}>
                    {availableOptions.length
                      ? 'Add metamagic'
                      : 'No more options'}
                  </Text>
                </Group>
              </Group>
            </Card>
          </SimpleGrid>
        )}
      </Paper>

      <AddMetamagicModal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        options={availableOptions}
        onPick={handleAdd}
      />
    </Stack>
  );
}
