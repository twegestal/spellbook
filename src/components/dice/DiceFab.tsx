import { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Dices } from 'lucide-react';
import { DiceRoller } from './DiceRoller';

export function DiceFab() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label="Dice roller" position="left">
        <ActionIcon
          size="xl"
          radius="xl"
          color="violet"
          variant="filled"
          onClick={() => setOpened(true)}
          style={{
            position: 'fixed',
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
            right: '1.5rem',
            zIndex: 200,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <Dices size={22} />
        </ActionIcon>
      </Tooltip>

      <DiceRoller opened={opened} onClose={() => setOpened(false)} />
    </>
  );
}
