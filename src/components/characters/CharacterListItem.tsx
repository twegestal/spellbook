import type { FC } from 'react';
import { Card, HStack, Text, Badge, Stack } from '@chakra-ui/react';
import type { Character } from '../../types/character';

type Props = {
  character: Character;
  onClick: () => void;
};

export const CharacterListItem: FC<Props> = ({ character, onClick }) => {
  return (
    <Card.Root
      as="li"
      size="sm"
      onClick={onClick}
      cursor="pointer"
      _active={{ transform: 'scale(0.998)' }}
    >
      <Card.Body color="fg.muted">
        <HStack justifyContent="space-between" align="start">
          <HStack align="center" gap={3}>
            <Stack gap={0} minW={0}>
              <Text fontWeight="medium" color="fg">
                {character.name}
              </Text>
              <Text fontSize="sm" color="fg.muted">
                {[character.class, character.race].filter(Boolean).join(' • ')}
              </Text>
            </Stack>
          </HStack>

          <Badge colorPalette="purple">Lvl {character.level}</Badge>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
