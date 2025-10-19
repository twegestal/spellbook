import { useAuth } from '../context/auth';
import { Heading, Text, Stack, Button } from '@chakra-ui/react';
export const SettingsPage = () => {
  const { logout } = useAuth();
  return (
    <Stack gap={3}>
      <Heading size="md">Settings</Heading>
      <Text opacity={0.8}>Coming soon.</Text>
      <Button
        w="full"
        colorPalette="purple"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </Button>
    </Stack>
  );
};
