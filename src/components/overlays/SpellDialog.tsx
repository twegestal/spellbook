import { Dialog, Portal, Button, Box } from '@chakra-ui/react';
import { createOverlay } from '@chakra-ui/react';
import type { RefObject } from 'react';

export type SpellDialogProps = {
  title: string;
  content?: React.ReactNode;
  container?: RefObject<HTMLElement | null>;
};

export const spellDialog = createOverlay<SpellDialogProps>((props) => {
  const { title, content, container, ...rest } = props;

  return (
    <Dialog.Root {...rest} size={{ base: 'full', sm: 'md' }}>
      <Portal container={container}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {content ?? <Box opacity={0.8}>Loading details…</Box>}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" w="full" colorPalette={'purple'}>
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
