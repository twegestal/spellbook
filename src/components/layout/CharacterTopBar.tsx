import { Box, IconButton, Text } from '@chakra-ui/react';
import { CiCirclePlus } from 'react-icons/ci';

type CharactersTopBarProps = {
  onCreate: () => void;
};

export const CharacterTopBar = ({ onCreate }: CharactersTopBarProps) => {
  return (
    <Box
      h="56px"
      px={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth="1px"
      position="sticky"
      top={0}
      bg="bg"
      zIndex={1}
    >
      <Text fontWeight="semibold">Characters</Text>

      <IconButton
        aria-label="Create character"
        variant="ghost"
        size="lg"
        onClick={onCreate}
      >
        <CiCirclePlus />
      </IconButton>
    </Box>
  );
};
