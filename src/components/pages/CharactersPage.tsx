import { useEffect } from 'react';
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';
import { useCharacters } from '../../hooks/useCharacters';
import { CharacterListItem } from '../characters/CharacterListItem';

export default function CharactersPage() {
  const { setLeft, setRight } = useHeader();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useCharacters();

  useEffect(() => {
    setLeft(<Text fw={600}>Characters</Text>);
    setRight(
      <ActionIcon
        aria-label="Create character"
        variant="subtle"
        onClick={() => navigate('/characters/new')}
      >
        <Plus size={18} />
      </ActionIcon>
    );
  }, [setLeft, setRight, navigate]);

  if (isLoading) {
    return (
      <Center mih="50vh">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Stack gap="sm" py="md">
        <Alert
          variant="light"
          color="red"
          title="Failed to load characters"
          icon={<AlertCircle size={16} />}
        >
          <Text fz="sm">{(error as Error)?.message ?? 'Unknown error'}</Text>
        </Alert>
      </Stack>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Stack gap="md" py="lg" align="flex-start">
        <Text c="dimmed">
          You don’t have any characters yet. Create your first one to get
          started.
        </Text>
        <Button onClick={() => navigate('/characters/new')}>
          Create character
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md" py="md">
      <Stack
        component="ul"
        gap="sm"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {data.map((c) => (
          <CharacterListItem
            key={c.id}
            character={c}
            onClick={() => navigate(`/characters/${c.id}`)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
