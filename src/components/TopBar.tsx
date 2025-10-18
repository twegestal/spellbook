import { Box, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { Menu, X } from 'lucide-react';

type TopBarProps = {
  query: string;
  onQueryChange: (v: string) => void;
  onOpenMenu: () => void;
};

export function TopBar({ query, onQueryChange, onOpenMenu }: TopBarProps) {
  return (
    <Box
      h="56px"
      px={3}
      display="flex"
      alignItems="center"
      gap={2}
      borderBottomWidth="1px"
      position="sticky"
      top={0}
      bg="bg"
      zIndex={1}
    >
      <InputGroup fontSize={'16px'} flex="1" startElement={<LuSearch />}>
        <Input
          size="sm"
          value={query}
          placeholder="Search spells…"
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </InputGroup>

      {query ? (
        <IconButton
          aria-label="Clear search"
          variant="ghost"
          size="lg"
          onClick={() => onQueryChange('')}
        >
          <X />
        </IconButton>
      ) : null}

      <IconButton
        aria-label="Open menu"
        variant="ghost"
        size="lg"
        onClick={onOpenMenu}
      >
        <Menu />
      </IconButton>
    </Box>
  );
}
