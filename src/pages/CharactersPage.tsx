import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { LoadingSpinner } from '../components/overlays/LoadingSpinner';
import { useCharacters } from '../hooks/useCharacters';
import { CharacterListItem } from '../components/characters/CharacterListItem';
import { CharacterTopBar } from '../components/layout/CharacterTopBar';
import { useNavigate } from 'react-router-dom';

export const CharactersPage = () => {
  const { data, isLoading, isError, error } = useCharacters();

  const navigate = useNavigate();

  const handleCreateCharacter = () => navigate('/characters/new');

  if (isLoading) {
    return (
      <Box minH="100dvh" display="grid" placeItems="center" p={6}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (isError) {
    return (
      <Stack gap={3} py={6}>
        <Heading size="md">Characters</Heading>
        <Text color="red.500">Failed to load characters.</Text>
        <Text fontSize="sm" opacity={0.8}>
          {(error as Error)?.message ?? 'Unknown error'}
        </Text>
      </Stack>
    );
  }

  if (!data || data?.length === 0) {
    return (
      <Stack gap={4} py={6} align="flex-start">
        <Heading size="md">Characters</Heading>
        <Text opacity={0.85}>
          You don’t have any characters yet. Create your first one to get
          started.
        </Text>
        <Button
          onClick={handleCreateCharacter}
          variant="solid"
          colorPalette="purple"
        >
          Create character
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap={0}>
      <CharacterTopBar onCreate={handleCreateCharacter} />

      <Stack gap={4} py={4} px={3}>
        <Stack as="ul" gap={3}>
          {data.map((c) => (
            <CharacterListItem
              key={c.id}
              character={c}
              onClick={() => navigate(`/characters/${c.id}`)}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
