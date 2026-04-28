import { modals } from '@mantine/modals';
import { Button, Group, NumberInput, Select, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import type { Character } from '../../types/character';
import { useClasses } from '../../hooks/useMetadata';

type Props = {
  character: Character;
  onLevelUp: (opts: { classId: number; level: number }) => void;
  onAddClass: (opts: { className: string; level: number }) => void;
};

function LevelUpModalContent({ character, onLevelUp, onAddClass }: Props) {
  const { data: classesData } = useClasses();

  const [selectedClassId, setSelectedClassId] = useState<number | null>(
    character.classes[0]?.id ?? null,
  );
  const [newLevel, setNewLevel] = useState<number | string>(
    (character.classes[0]?.level ?? 0) + 1,
  );
  const [addingClass, setAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState<string | null>(null);
  const [newClassLevel, setNewClassLevel] = useState<number | string>(1);

  const totalLevel = character.level;
  const remainingLevels = 20 - totalLevel;

  const selectedClass = character.classes.find((c) => c.id === selectedClassId);

  const takenClassNames = new Set(
    character.classes.map((c) => c.name.toLowerCase()),
  );
  const availableClasses = (classesData ?? [])
    .filter((c) => !takenClassNames.has(c.name.toLowerCase()))
    .map((c) => ({ value: c.name, label: c.name }));

  const classOptions = character.classes.map((c) => ({
    value: String(c.id),
    label: `${c.name} (level ${c.level})`,
  }));

  const close = () => modals.closeAll();

  const handleLevelUp = () => {
    if (!selectedClassId || !selectedClass) return;
    const level = Number(newLevel);
    if (level <= selectedClass.level) return;
    onLevelUp({ classId: selectedClassId, level });
    close();
  };

  const handleAddClass = () => {
    if (!newClassName) return;
    onAddClass({ className: newClassName, level: Number(newClassLevel) });
    close();
  };

  if (!addingClass) {
    return (
      <Stack gap="md">
        <Text fz="sm" c="dimmed">
          Total level: {totalLevel}/20
        </Text>

        {character.classes.length > 1 && (
          <Select
            label="Which class to level up?"
            data={classOptions}
            value={selectedClassId ? String(selectedClassId) : null}
            onChange={(val) => {
              if (!val) return;
              setSelectedClassId(Number(val));
              const cls = character.classes.find((c) => c.id === Number(val));
              if (cls) setNewLevel(cls.level + 1);
            }}
          />
        )}

        {selectedClass && (
          <NumberInput
            label={`New level for ${selectedClass.name}`}
            description={`Currently level ${selectedClass.level}`}
            value={newLevel}
            min={selectedClass.level + 1}
            max={20}
            onChange={setNewLevel}
          />
        )}

        <Group justify="space-between" mt="xs">
          {remainingLevels > 0 && availableClasses.length > 0 && (
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setAddingClass(true)}
            >
              Add new class instead
            </Button>
          )}
          <Group ml="auto">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleLevelUp}
              disabled={
                !selectedClassId ||
                !selectedClass ||
                Number(newLevel) <= selectedClass.level
              }
            >
              Confirm
            </Button>
          </Group>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Text fz="sm" c="dimmed">
        {remainingLevels} level(s) available for new class.
      </Text>

      <Select
        label="New class"
        placeholder="Select class"
        data={availableClasses}
        value={newClassName}
        onChange={setNewClassName}
        searchable
        nothingFoundMessage="No available classes"
      />

      <NumberInput
        label="Starting level"
        value={newClassLevel}
        min={1}
        max={remainingLevels}
        onChange={setNewClassLevel}
      />

      <Group justify="space-between" mt="xs">
        <Button
          variant="subtle"
          size="sm"
          onClick={() => setAddingClass(false)}
        >
          Back
        </Button>
        <Group>
          <Button variant="subtle" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleAddClass} disabled={!newClassName}>
            Add class
          </Button>
        </Group>
      </Group>
    </Stack>
  );
}

export function openLevelUpModal(opts: Props) {
  modals.open({
    title: `Level up — ${opts.character.name}`,
    centered: true,
    withCloseButton: true,
    size: 'sm',
    children: (
      <LevelUpModalContent
        character={opts.character}
        onLevelUp={opts.onLevelUp}
        onAddClass={opts.onAddClass}
      />
    ),
  });
}
