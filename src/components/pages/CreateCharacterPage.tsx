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
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRaces, useClasses } from '../../hooks/useMetadata';
import { useCreateCharacter } from '../../hooks/useCharacters';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';
import { AlertCircle } from 'lucide-react';

export default function CreateCharacterPage() {
  const navigate = useNavigate();
  const { setLeft, setRight } = useHeader();

  const { data: racesData, isLoading: loadingRaces } = useRaces();
  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const { mutate, isPending, isError, error } = useCreateCharacter();

  const [name, setName] = useState('');
  const [race, setRace] = useState<string | null>(null);
  const [charClass, setCharClass] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLeft(<Text fw={600}>Create Character</Text>);
    setRight(null);
  }, [setLeft, setRight]);

  const races = useMemo(
    () => (racesData ?? []).map((r) => ({ label: r.name, value: r.name })),
    [racesData]
  );

  const classes = useMemo(
    () => (classesData ?? []).map((c) => ({ label: c.name, value: c.name })),
    [classesData]
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Please enter a name.';
    if (!race) next.race = 'Please select a race.';
    if (!charClass) next.class = 'Please select a class.';
    if (!(level >= 1 && level <= 20)) next.level = 'Level must be 1–20.';
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
      { onSuccess: () => navigate('/characters') }
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

            <Select
              label="Class"
              placeholder="Select class"
              data={classes}
              value={charClass}
              onChange={setCharClass}
              searchable
              nothingFoundMessage="No classes"
              error={errors.class}
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
            />

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
              loading={isPending}
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
