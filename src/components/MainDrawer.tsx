import { type FC } from 'react';
import {
  Drawer,
  Button,
  Text,
  CloseButton,
  Stack,
  Box,
} from '@chakra-ui/react';
import { useAuth } from '../context/auth';

type MainDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const MainDrawer: FC<MainDrawerProps> = ({ open, onOpenChange }) => {
  const { logout } = useAuth();

  return (
    <Drawer.Root
      placement="end"
      size={{ base: 'full', sm: 'xs' }}
      open={open}
      onOpenChange={(details) => {
        const next = typeof details === 'boolean' ? details : details.open;
        onOpenChange(next);
      }}
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content display="flex" flexDirection="column" maxH="100dvh">
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" position="absolute" top="4" right="4" />
          </Drawer.CloseTrigger>

          <Drawer.Header>
            <Drawer.Title>Menu</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body flex="1" overflowY="auto">
            <Text mb={4}>Spells, Classes, Bookmarks — coming soon.</Text>
          </Drawer.Body>

          <Drawer.Footer p={0}>
            <Box
              position="sticky"
              bottom="0"
              w="full"
              bg="bg"
              borderTopWidth="1px"
              px={4}
              pt={3}
              pb="calc(env(safe-area-inset-bottom) + 12px)"
            >
              <Stack w="full" gap={2}>
                <Button
                  w="full"
                  colorPalette="purple"
                  onClick={() => {
                    logout();
                    onOpenChange(false);
                  }}
                >
                  Logout
                </Button>

                <Drawer.ActionTrigger asChild>
                  <Button variant="outline" w="full">
                    Close
                  </Button>
                </Drawer.ActionTrigger>
              </Stack>
            </Box>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
