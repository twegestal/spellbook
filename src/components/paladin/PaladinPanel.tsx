import {
  Stack,
  Paper,
  Text,
  Group,
  Button,
  SimpleGrid,
  Loader,
  Center,
} from '@mantine/core';
import { Swords } from 'lucide-react';
import {
  useResources,
  useSpendResource,
  useRestoreResource,
  useSetResource,
} from '../../hooks/useResources';
import { useSpellSlots } from '../../hooks/useSpellSlots';
import { ResourceCard } from '../shared/ResourceCard';
import { openCastSpellModal } from '../overlays/openCastSpellModal';
import { notifications } from '@mantine/notifications';
import { useToggleSpellSlot } from '../../hooks/useToggleSpellSlot';
import { useEffect, useState } from 'react';
import { SpendResourceModal } from '../shared/SpendResourceModal';
import { spawnDamageBlast } from '../animations/spawnDamageBlast';

type Props = {
  characterId: string;
  characterLevel: number;
};

function getChannelDivinityMax(level: number): number {
  if (level >= 18) return 3;
  if (level >= 6) return 2;
  return 1;
}

function getLayOnHandsMax(level: number): number {
  return level * 5;
}

export function PaladinPanel({ characterId, characterLevel }: Props) {
  const { data: resources, isLoading } = useResources(characterId);
  const { data: slots } = useSpellSlots(characterId);
  const spend = useSpendResource(characterId);
  const restore = useRestoreResource(characterId);
  const setResource = useSetResource(characterId);
  const toggle = useToggleSpellSlot();
  const [layOnHandsOpen, setLayOnHandsOpen] = useState(false);

  useEffect(() => {
    if (!resources) return;

    const expectedChannelDivinity = getChannelDivinityMax(characterLevel);
    const expectedLayOnHands = getLayOnHandsMax(characterLevel);

    const channelDivinity = resources.find((r) => r.key === 'channel_divinity');
    const layOnHands = resources.find((r) => r.key === 'lay_on_hands');

    if (
      !channelDivinity ||
      channelDivinity.maximum !== expectedChannelDivinity
    ) {
      setResource.mutate({
        key: 'channel_divinity',
        maximum: expectedChannelDivinity,
        resets_on: 'short',
      });
    }

    if (!layOnHands || layOnHands.maximum !== expectedLayOnHands) {
      setResource.mutate({
        key: 'lay_on_hands',
        maximum: expectedLayOnHands,
        resets_on: 'long',
      });
    }
  }, [resources, characterLevel]);

  const channelDivinity = resources?.find((r) => r.key === 'channel_divinity');
  const layOnHands = resources?.find((r) => r.key === 'lay_on_hands');

  const handleDivineSmite = () => {
    if (!slots) return;

    const smiteSpell = {
      id: 'divine-smite',
      name: 'Divine Smite',
      level: 1,
      damage_type_name: 'radiant',
    } as any;

    openCastSpellModal({
      spell: smiteSpell,
      slots,
      onPick: (slotLevel, slotIndex, isPact) => {
        if (slotLevel === 0) return;
        toggle.mutate(
          { characterId, slotLevel, slotIndex, isPact },
          {
            onError: () => {
              notifications.show({
                color: 'red',
                message: 'Failed to spend slot for Divine Smite',
              });
            },
            onSuccess: () => {
              spawnDamageBlast('radiant');
            },
          },
        );
      },
    });
  };

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
          <Text fw={600}>Divine Smite</Text>
        </Group>
        <Text fz="sm" c="dimmed" mb="md">
          Expend a spell slot when you hit with a melee weapon attack to deal
          extra radiant damage. The damage increases by 1d8 per slot level above
          1st, and by 1d8 against undead or fiends.
        </Text>
        <Button
          leftSection={<Swords size={16} />}
          variant="light"
          color="yellow"
          onClick={handleDivineSmite}
          loading={toggle.isPending}
          disabled={!slots}
        >
          Smite!
        </Button>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Text fw={600} mb="sm">
          Class resources
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {channelDivinity && (
            <ResourceCard
              resource={channelDivinity}
              label="Channel Divinity"
              description="Resets on short or long rest"
              color="yellow"
              onSpend={() => spend.mutate({ key: 'channel_divinity' })}
              onRestore={() =>
                restore.mutate({ key: 'channel_divinity', qty: 1 })
              }
              isSpending={spend.isPending}
              isRestoring={restore.isPending}
            />
          )}
          {layOnHands && (
            <>
              <ResourceCard
                resource={layOnHands}
                label="Lay on Hands"
                description={`${layOnHands.maximum} HP pool — resets on long rest`}
                color="green"
                onSpend={() => setLayOnHandsOpen(true)}
                onRestore={() =>
                  restore.mutate({ key: 'lay_on_hands', qty: 5 })
                }
                isSpending={spend.isPending}
                isRestoring={restore.isPending}
              />
              <SpendResourceModal
                opened={layOnHandsOpen}
                onClose={() => setLayOnHandsOpen(false)}
                label="Lay on Hands"
                max={layOnHands.current}
                busy={spend.isPending}
                onConfirm={(qty) => {
                  spend.mutate(
                    { key: 'lay_on_hands', qty },
                    { onSuccess: () => setLayOnHandsOpen(false) },
                  );
                }}
              />
            </>
          )}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
