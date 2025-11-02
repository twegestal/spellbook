import { Button } from '@mantine/core';
import { useAuth } from '../../context/auth';

export default function SettingsPage() {
  const { logout } = useAuth();

  return <Button onClick={logout}>Logout</Button>;
}
