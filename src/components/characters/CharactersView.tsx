import { Box, Stack, Text, Card, Badge, Button } from '@chakra-ui/react';
import { useCharacters } from '../../hooks/useCharacters';
import { createCharacterDialog } from '../overlays/createCharacterDialog';

export function CharactersView() {
  const { data: chars, isLoading, isError } = useCharacters();

  if (isLoading) {
    return (
      <Box flex="1" display="grid" placeItems="center" p={4}>
        <Text opacity={0.8}>Loading characters…</Text>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box flex="1" display="grid" placeItems="center" p={4}>
        <Text color="red.500">Failed to load characters.</Text>
      </Box>
    );
  }

  if (!chars || chars.length === 0) {
    return (
      <Box flex="1" display="grid" placeItems="center" p={8} textAlign="center">
        <Stack gap={3} maxW="sm">
          <Text fontSize="lg" fontWeight="semibold">
            No characters yet
          </Text>
          <Text opacity={0.8}>
            Create your first character to start tracking known and prepared
            spells.
          </Text>
          <Button
            colorPalette="purple"
            onClick={() => createCharacterDialog.open('create-character', {})}
          >
            Create character
          </Button>
        </Stack>
        <createCharacterDialog.Viewport />
      </Box>
    );
  }

  return (
    <>
      <Stack as="ul" gap={3} p={3}>
        {chars.map((c) => (
          <Card.Root key={c.id} as="li" size="sm">
            <Card.Body
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              py={3}
            >
              <Stack gap={0} minW={0}>
                <Text fontWeight="semibold" lineClamp={1}>
                  {c.name}
                </Text>
                <Text fontSize="sm" color="fg.muted" lineClamp={1}>
                  {c.race} • {c.class}
                </Text>
              </Stack>
              <Badge colorPalette="purple">Lvl {c.level}</Badge>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>
      <createCharacterDialog.Viewport />
    </>
  );
}
