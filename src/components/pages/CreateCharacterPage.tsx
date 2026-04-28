import {
  Box,
  Button,
  Loader,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Alert,
  Card,
  Group,
  ActionIcon,
  Divider,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRaces, useClasses } from '../../hooks/useMetadata';
import {
  useCreateCharacter,
  useAddCharacterClass,
} from '../../hooks/useCharacters';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

type ExtraClass = {
  class: string;
  level: number;
};

export default function CreateCharacterPage() {
  const navigate = useNavigate();
  const { setLeft, setRight } = useHeader();

  const { data: racesData, isLoading: loadingRaces } = useRaces();
  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const { mutate, isPending, isError, error } = useCreateCharacter();
  const addClass = useAddCharacterClass();

  const [name, setName] = useState('');
  const [race, setRace] = useState<string | null>(null);
  const [charClass, setCharClass] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [extraClasses, setExtraClasses] = useState<ExtraClass[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLeft(<Text fw={600}>Create Character</Text>);
    setRight(null);
  }, [setLeft, setRight]);

  const races = useMemo(
    () => (racesData ?? []).map((r) => ({ label: r.name, value: r.name })),
    [racesData],
  );

  const allClasses = useMemo(
    () => (classesData ?? []).map((c) => ({ label: c.name, value: c.name })),
    [classesData],
  );

  // Filtrera bort redan valda klasser
  const availableForExtra = useMemo(() => {
    const taken = new Set(
      [charClass, ...extraClasses.map((e) => e.class)].filter(Boolean),
    );
    return allClasses.filter((c) => !taken.has(c.value));
  }, [allClasses, charClass, extraClasses]);

  const totalLevel = level + extraClasses.reduce((sum, e) => sum + e.level, 0);

  const addExtraClass = () => {
    if (availableForExtra.length === 0) return;
    setExtraClasses((prev) => [
      ...prev,
      { class: availableForExtra[0].value, level: 1 },
    ]);
  };

  const updateExtraClass = (
    index: number,
    field: keyof ExtraClass,
    value: string | number,
  ) => {
    setExtraClasses((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
    );
  };

  const removeExtraClass = (index: number) => {
    setExtraClasses((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please enter a name.';
    if (!race) next.race = 'Please select a race.';
    if (!charClass) next.class = 'Please select a class.';
    if (!(level >= 1 && level <= 20)) next.level = 'Level must be 1–20.';
    if (totalLevel > 20) next.total = 'Total level cannot exceed 20.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onCreate = () => {
    if (!validate()) return;

    mutate(
      {
        name,
        race: race as string,
        class: charClass as string,
        level,
      },
      {
        onSuccess: async (character) => {
          // Lägg till extra klasser sekventiellt
          for (const extra of extraClasses) {
            await addClass.mutateAsync({
              characterId: character.id,
              class: extra.class,
              level: extra.level,
            });
          }
          navigate('/characters');
        },
      },
    );
  };

  const isLoading = loadingRaces || loadingClasses;

  if (isLoading) {
    return (
      <Box mih="50vh" display="grid" style={{ placeItems: 'center' }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box p="lg">
      <Stack maw={400} mx="auto" gap="lg">
        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Character name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              error={errors.name}
            />

            <Select
              label="Race"
              placeholder="Select race"
              data={races}
              value={race}
              onChange={setRace}
              searchable
              nothingFoundMessage="No races"
              error={errors.race}
            />

            <Divider label="Primary class" labelPosition="left" />

            <Group align="flex-end" gap="sm">
              <Select
                label="Class"
                placeholder="Select class"
                data={allClasses}
                value={charClass}
                onChange={setCharClass}
                searchable
                nothingFoundMessage="No classes"
                error={errors.class}
                style={{ flex: 1 }}
              />
              <NumberInput
                label="Level"
                min={1}
                max={20}
                value={level}
                onChange={(val) =>
                  setLevel(Math.max(1, Math.min(20, Number(val) || 1)))
                }
                error={errors.level}
                style={{ width: 80 }}
              />
            </Group>

            {extraClasses.length > 0 && (
              <>
                <Divider label="Additional classes" labelPosition="left" />
                {extraClasses.map((extra, index) => (
                  <Group key={index} align="flex-end" gap="sm">
                    <Select
                      label="Class"
                      data={[
                        ...availableForExtra,
                        { label: extra.class, value: extra.class },
                      ]}
                      value={extra.class}
                      onChange={(val) =>
                        val && updateExtraClass(index, 'class', val)
                      }
                      searchable
                      style={{ flex: 1 }}
                    />
                    <NumberInput
                      label="Level"
                      min={1}
                      max={20}
                      value={extra.level}
                      onChange={(val) =>
                        updateExtraClass(
                          index,
                          'level',
                          Math.max(1, Math.min(20, Number(val) || 1)),
                        )
                      }
                      style={{ width: 80 }}
                    />
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeExtraClass(index)}
                      mb={4}
                    >
                      <Trash2 size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </>
            )}

            {errors.total && (
              <Text c="red" fz="sm">
                {errors.total}
              </Text>
            )}

            <Text fz="sm" c="dimmed">
              Total level: {totalLevel}/20
            </Text>

            {availableForExtra.length > 0 && totalLevel < 20 && (
              <Button
                variant="subtle"
                leftSection={<Plus size={16} />}
                onClick={addExtraClass}
                size="sm"
              >
                Add multiclass
              </Button>
            )}

            {isError && (
              <Alert
                icon={<AlertCircle size={16} />}
                color="red"
                variant="light"
                title="Failed to create character"
              >
                {(error as Error)?.message ?? 'Unknown error'}
              </Alert>
            )}

            <Button
              onClick={onCreate}
              loading={isPending || addClass.isPending}
              fullWidth
              size="md"
              radius="md"
            >
              {isPending ? 'Creating…' : 'Create'}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
