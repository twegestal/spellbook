import { useEffect } from 'react';
import { Button, Title } from '@mantine/core';
import { useHeader } from '../../components/layout/AppShell/AppShellLayout';

export default function CharactersPage() {
  const { setLeft, setRight } = useHeader();
  useEffect(() => {
    setLeft(<Title order={4}>Characters</Title>);
    setRight(<Button size="xs">New</Button>);
  }, [setLeft, setRight]);

  return <div>Characters (coming soon)</div>;
}
