import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core';
import { Sun, Moon } from 'lucide-react';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });
  const toggle = () => setColorScheme(computed === 'dark' ? 'light' : 'dark');

  return (
    <ActionIcon
      variant="subtle"
      onClick={toggle}
      aria-label="Toggle color scheme"
    >
      {computed === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </ActionIcon>
  );
}
