import { Button, Title } from '@mantine/core';
import { useAuth } from '../../context/auth';
import { useHeader } from '../layout/AppShell/AppShellLayout';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { setLeft, setRight } = useHeader();
  useEffect(() => {
    setLeft(<Title order={4}>Settings</Title>);
    setRight(null);
  }, [setLeft, setRight]);

  return <Button onClick={logout}>Logout</Button>;
}
