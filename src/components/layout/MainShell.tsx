import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MainShell = () => (
  <Box minH="100dvh" display="grid" gridTemplateRows="1fr auto">
    <Container maxW="container.md" py={4}>
      <Outlet />
    </Container>
    <BottomNav />
  </Box>
);
