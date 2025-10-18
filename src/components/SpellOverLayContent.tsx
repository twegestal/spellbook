import type { Spell } from '@/types/spells';
import { Box, Text } from '@chakra-ui/react';
import type { FC } from 'react';

type Props = {
  spell: Spell;
};

export const SpellOverlayContent: FC<Props> = ({ spell }) => {
  return (
    <Box>
      <Text fontSize="sm" color="fg.muted" mb={2}>
        Level {spell.level === 0 ? 'Cantrip' : spell.level}
      </Text>
      <Text>More details coming soon…</Text>
    </Box>
  );
};
