import { useState } from 'react';
import {
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Plus } from 'lucide-react';
import { useHomebrewSpells } from '../../hooks/useHomebrewSpells';
import {
  useSchools,
  useDamageTypes,
  useSpellClasses,
} from '../../hooks/useMetadata';
import { HomebrewSpellList } from '../homebrew/HomebrewSpellList';
import { SpellBuilderDrawer } from '../homebrew/SpellBuilderDrawer';
import type { Spell } from '../../types/spells';

export default function HomebrewPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editSpell, setEditSpell] = useState<Spell | undefined>(undefined);

  const { data: spellData, isLoading: spellsLoading } = useHomebrewSpells();
  const { data: schoolData, isLoading: schoolsLoading } = useSchools();
  const { data: damageTypeData, isLoading: damageTypesLoading } =
    useDamageTypes();
  const { data: spellClassData, isLoading: spellClassesLoading } =
    useSpellClasses();

  const isLoading =
    spellsLoading ||
    schoolsLoading ||
    damageTypesLoading ||
    spellClassesLoading;

  if (isLoading) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  const spells = spellData?.results ?? [];
  const schools = schoolData?.results ?? [];
  const damageTypes = damageTypeData?.results ?? [];
  const spellClasses = spellClassData?.results ?? [];

  const handleEdit = (spell: Spell) => {
    setEditSpell(spell);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditSpell(undefined);
  };

  return (
    <>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={3}>My homebrew spells</Title>
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => setDrawerOpen(true)}
          >
            New spell
          </Button>
        </Group>

        {spells.length === 0 ? (
          <Center mih="30vh">
            <Stack align="center" gap="xs">
              <Text c="dimmed">No homebrew spells yet.</Text>
              <Text c="dimmed" fz="sm">
                Create your first one with the button above!
              </Text>
            </Stack>
          </Center>
        ) : (
          <HomebrewSpellList spells={spells} onEdit={handleEdit} />
        )}
      </Stack>

      <SpellBuilderDrawer
        opened={drawerOpen}
        onClose={handleClose}
        schools={schools}
        damageTypes={damageTypes}
        spellClasses={spellClasses}
        editSpell={editSpell}
      />
    </>
  );
}
