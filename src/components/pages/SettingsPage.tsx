import { Button, Title } from '@mantine/core';
import { useAuth } from '../../context/auth';
import { useHeader } from '../layout/AppShell/AppShellLayout';
import { useEffect } from 'react';
import { ColorSchemeToggle } from '../layout/ColorSchemeToggle';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { setLeft, setRight } = useHeader();
  useEffect(() => {
    setLeft(<Title order={4}>Settings</Title>);
    setRight(<ColorSchemeToggle />);
  }, [setLeft, setRight]);

  return <Button onClick={logout}>Logout</Button>;
}
