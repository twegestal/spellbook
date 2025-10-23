import { Box } from '@chakra-ui/react';

export const Dot = ({
  isSpent,
  onClick,
}: {
  isSpent: boolean;
  onClick: () => void;
}) => (
  <Box
    as="button"
    aria-label="Open slot picker"
    onClick={onClick}
    w="18px"
    h="18px"
    borderRadius="full"
    borderWidth="1px"
    borderColor="purple.800"
    bg={isSpent ? 'purple.800' : 'transparent'}
    opacity={isSpent ? 0.95 : 0.75}
    position="relative"
    _after={{
      content: '""',
      position: 'absolute',
      inset: '-10px',
    }}
    _hover={{
      boxShadow: '0 0 0 2px rgba(255,255,255,0.15)',
    }}
    _active={{
      transform: 'scale(0.96)',
    }}
  />
);
